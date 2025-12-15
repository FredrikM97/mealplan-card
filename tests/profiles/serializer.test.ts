import { describe, it, expect } from 'vitest';
import {
  parseTemplate,
  chunkLength,
  getEncoder,
  EncodingType,
  createDayTransformer,
  createFirstDayTransformer,
} from '../../src/profiles/serializer';
import { f, TemplateFieldName as F, Day } from '../../src/types';
import { FeedingTime } from '../../src/types';
import { daySpecificMeals } from '../fixtures/data';

describe('parseTemplate', () => {
  it('throws error for empty template', () => {
    expect(() => parseTemplate('')).toThrow('Invalid template');
  });

  it('throws error for non-string template', () => {
    expect(() => parseTemplate(null as any)).toThrow('Invalid template');
  });

  it('throws error for unexpected characters between tokens', () => {
    expect(() =>
      parseTemplate(`${f(F.DAYS, 2)}INVALID${f(F.HOUR, 2)}`),
    ).toThrow('Invalid template: unexpected characters between tokens');
  });

  it('throws error for invalid token length', () => {
    expect(() => parseTemplate('{DAYS:0}')).toThrow('Invalid token length');
  });

  it('throws error if tokens do not cover entire template', () => {
    expect(() => parseTemplate(`${f(F.DAYS, 2)}EXTRA`)).toThrow(
      'Invalid template: tokens must exactly cover template',
    );
  });

  it('parses valid template correctly', () => {
    const result = parseTemplate(`${f(F.DAYS, 2)}${f(F.HOUR, 2)}`);
    expect(result).toEqual([
      { name: 'DAYS', length: 2 },
      { name: 'HOUR', length: 2 },
    ]);
  });
});

describe('chunkLength', () => {
  it('calculates total length correctly', () => {
    const tokens = [
      { name: 'DAYS', length: 2 },
      { name: 'HOUR', length: 2 },
      { name: 'MINUTE', length: 2 },
    ];
    expect(chunkLength(tokens)).toBe(6);
  });
});

describe('encoder decode/encode', () => {
  const encoder = getEncoder({
    manufacturer: 'Test',
    models: [],
    fields: [],
    encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}`,
  });

  it('decode returns [] for unknown base64 string', () => {
    const result = encoder.decode('unknown');
    expect(result).toEqual([]);
  });

  it('encode returns empty string for empty feedingTimes', () => {
    const encoded = encoder.encode([]);
    expect(encoded).toBe('');
  });

  it('encode and decode are inverses for generic data', () => {
    const encoder2 = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.DAYS, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}`,
    });
    const feedingTimes: FeedingTime[] = [
      daySpecificMeals.weekdaysOnly,
      { ...daySpecificMeals.weekendsOnly, enabled: 0 }, // Disabled version
    ];
    const encoded = encoder2.encode(feedingTimes);
    const decoded = encoder2.decode(encoded);
    expect(decoded).toEqual(feedingTimes);
  });
});

describe('encoder error handling', () => {
  it('throws on invalid base64', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: f(F.HOUR, 2),
    });
    expect(() => encoder.decode('!@#$')).toThrow('Invalid base64');
  });

  it('throws on invalid profile', () => {
    expect(() =>
      getEncoder({
        manufacturer: 'Test',
        models: [],
        fields: [],
        encodingTemplate: undefined as any,
      }),
    ).toThrow('Invalid device profile for encoding/decoding');
  });

  it('throws on invalid meal plan length', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}`,
    });
    expect(() => encoder.decode('AAA=')).toThrow(
      'Invalid templated meal plan length',
    );
  });
});

describe('TemplateEncoder edge cases', () => {
  it('handles null/undefined values by padding with zeros', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}`,
    });
    const result = encoder.encode([
      { hour: null as any, minute: undefined as any },
    ]);
    expect(result).toBe('0000');
  });

  it('handles FILL token correctly', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.FILL, 2)}`,
    });
    const result = encoder.encode([{ hour: 8 }]);
    expect(result).toBe('0800');
  });

  it('applies custom day encoding transformer', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.DAYS, 2)}`,
      encode: (value: number) => value ^ 0xff, // XOR transformer
    });
    const result = encoder.encode([{ days: 127 }]);
    expect(result).toBe('80'); // 127 ^ 255 = 128 = 0x80
  });

  it('applies custom day decoding transformer', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.DAYS, 2)}`,
      decode: (value: number) => value ^ 0xff, // XOR transformer
    });
    const result = encoder.decode('80');
    expect(result[0].days).toBe(127); // 128 ^ 255 = 127
  });

  it('throws error when template is not provided', () => {
    expect(() => {
      new (getEncoder as any).TemplateEncoder();
    }).toThrow();
  });

  it('decodes empty string to empty array', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.HOUR, 2)}`,
    });
    const result = encoder.decode('');
    expect(result).toEqual([]);
  });
});

describe('createFirstDayTransformer', () => {
  // Tests for day transformers that convert between:
  // - Internal format: bit 0 (rightmost) = Monday, bit 6 (leftmost) = Sunday
  // - Device format: varies by device (Monday-first, Sunday-first, etc.)
  //
  // Bit positions use standard binary notation (bit 0 = LSB/rightmost)

  it('Monday-first: identity transform (no conversion needed)', () => {
    const transformer = createFirstDayTransformer(Day.Monday);

    // When device is also Monday-first, no transformation occurs
    // This is the default case where internal = device format
    expect(transformer.encode(1)).toBe(1); // Monday stays as bit 0
    expect(transformer.encode(64)).toBe(64); // Sunday stays as bit 6
    expect(transformer.encode(127)).toBe(127); // All days unchanged
  });

  it('Monday-first: encode/decode preserves all values (identity)', () => {
    const transformer = createFirstDayTransformer(Day.Monday);
    // Verify identity transform for all possible day combinations (0-127)
    for (let i = 0; i < 128; i++) {
      expect(transformer.encode(i)).toBe(i);
      expect(transformer.decode(i)).toBe(i);
    }
  });

  it('Sunday-first (Tuya): device bit 0=Sun, 1=Mon...6=Sat', () => {
    const transformer = createFirstDayTransformer(Day.Sunday);

    // Transformation shifts bits: device starts week on Sunday instead of Monday
    // Internal: bit0=Mon, bit1=Tue...bit6=Sun
    // Device:   bit0=Sun, bit1=Mon...bit6=Sat

    // Internal bit 0 (Monday) → device bit 1 (Monday in Sunday-first)
    expect(transformer.encode(1)).toBe(2); // 0b0000001 → 0b0000010
    expect(transformer.decode(2)).toBe(1);

    // Internal bit 6 (Sunday) → device bit 0 (Sunday in Sunday-first)
    expect(transformer.encode(64)).toBe(1); // 0b1000000 → 0b0000001
    expect(transformer.decode(1)).toBe(64);
  });

  it('Sunday-first: encodes Mon+Tue correctly', () => {
    const transformer = createFirstDayTransformer(Day.Sunday);
    // Internal: bits 0,1 (Mon+Tue) = 3
    // Device: bits 1,2 (Mon+Tue in Sunday-first) = 6
    expect(transformer.encode(3)).toBe(6);
    expect(transformer.decode(6)).toBe(3);
  });

  it('Sunday-first: encodes Sun+Mon correctly', () => {
    const transformer = createFirstDayTransformer(Day.Sunday);
    // Internal: bits 0,6 (Mon+Sun) = 65
    // Device: bits 0,1 (Sun+Mon in Sunday-first) = 3
    expect(transformer.encode(65)).toBe(3);
    expect(transformer.decode(3)).toBe(65);
  });

  it('Sunday-first: encodes all days correctly', () => {
    const transformer = createFirstDayTransformer(Day.Sunday);
    // All 7 days = 127
    expect(transformer.encode(127)).toBe(127);
    expect(transformer.decode(127)).toBe(127);
  });

  it('Sunday-first: roundtrip preserves all combinations', () => {
    const transformer = createFirstDayTransformer(Day.Sunday);
    for (let i = 0; i < 128; i++) {
      const encoded = transformer.encode(i);
      const decoded = transformer.decode(encoded);
      expect(decoded).toBe(i);
    }
  });

  it('Saturday-first: correctly maps days', () => {
    const transformer = createFirstDayTransformer(Day.Saturday);

    // Device starts week on Saturday (bit 0)
    // Device:   bit0=Sat, bit1=Sun, bit2=Mon...bit6=Fri

    // Internal bit 0 (Monday) → device bit 2 (Monday in Saturday-first)
    expect(transformer.encode(1)).toBe(4); // 0b0000001 → 0b0000100
    expect(transformer.decode(4)).toBe(1);

    // Internal bit 5 (Saturday) → device bit 0 (Saturday in Saturday-first)
    expect(transformer.encode(32)).toBe(1); // 0b0100000 → 0b0000001
    expect(transformer.decode(1)).toBe(32);
  });
});

describe('createDayTransformer', () => {
  it('handles custom mappings (Puppy Kitty style)', () => {
    const transformer = createDayTransformer([
      [5, 0], // Sat → device bit 0
      [4, 1], // Fri → device bit 1
      [6, 6], // Sun → device bit 6
    ]);

    // Saturday (internal bit 5)
    expect(transformer.encode(32)).toBe(1);
    expect(transformer.decode(1)).toBe(32);

    // Friday (internal bit 4)
    expect(transformer.encode(16)).toBe(2);
    expect(transformer.decode(2)).toBe(16);
  });

  it('roundtrip preserves values with custom mapping', () => {
    const transformer = createDayTransformer([
      [0, 1],
      [1, 2],
      [2, 0],
    ]);

    const encoded = transformer.encode(7); // bits 0,1,2
    const decoded = transformer.decode(encoded);
    expect(decoded).toBe(7);
  });
});

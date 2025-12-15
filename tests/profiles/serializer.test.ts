import { describe, it, expect } from 'vitest';
import {
  parseTemplate,
  chunkLength,
  getEncoder,
  EncodingType,
  createDayTransformer,
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
  it('maps device bit 0 (0b00000001) to internal Sunday with Cleverio/Meowmatic mapping', () => {
    const transformer = createDayTransformer([
      [0, 6], // Mon
      [1, 5], // Tue
      [2, 4], // Wed
      [3, 3], // Thu
      [4, 2], // Fri
      [5, 1], // Sat
      [6, 0], // Sun
    ]);
    // Device bit 0 set (0b00000001) should map to internal bit 6 (Sunday)
    expect(transformer.decode(0b00000001)).toBe(1 << 6); // 0b1000000
    // And the reverse: encoding internal Sunday should set device bit 0
    expect(transformer.encode(1 << 6)).toBe(0b00000001);
  });
});

import { describe, it, expect } from 'vitest';
import { getEncoder } from '../../src/profiles/serializer';
import {
  createDayTransformer,
  createStringDayTransformer,
} from '../../src/profiles/transformers';
import { f, TemplateFieldName as F, Day, EncodingType } from '../../src/types';
import { FeedingTime } from '../../src/types';
import { daySpecificMeals } from '../fixtures/data';

describe('TemplateEncoder error handling', () => {
  it('throws error for empty template', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: '',
    });
    expect(() => encoder.encode([])).toThrow('Template is required');
  });

  it('throws error for invalid template with unexpected characters', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: `${f(F.DAYS, 2)}INVALID${f(F.HOUR, 2)}`,
    });
    expect(() => encoder.encode([])).toThrow(
      'Invalid template: unexpected characters between tokens',
    );
  });

  it('throws error for invalid token length', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: '{DAYS:0}',
    });
    expect(() => encoder.encode([])).toThrow('Invalid token length');
  });

  it('throws error if tokens do not cover entire template', () => {
    const encoder = getEncoder({
      manufacturer: 'Test',
      models: [],
      fields: [],
      encodingTemplate: `${f(F.DAYS, 2)}EXTRA`,
    });
    expect(() => encoder.encode([])).toThrow(
      'Invalid template: tokens must exactly cover template',
    );
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
    expect(() => getEncoder(undefined as any)).toThrow(
      'Device profile is required for encoder initialization',
    );
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
      encode: (entry: any) => ({ ...entry, days: entry.days ^ 0xff }), // XOR transformer
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
      decode: (entry: any) => ({ ...entry, days: entry.days ^ 0xff }), // XOR transformer
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
    expect(transformer.encode({ days: 32 }).days).toBe(1);
    expect(transformer.decode({ days: 1 }).days).toBe(32);

    // Friday (internal bit 4)
    expect(transformer.encode({ days: 16 }).days).toBe(2);
    expect(transformer.decode({ days: 2 }).days).toBe(16);
  });

  it('roundtrip preserves values with custom mapping', () => {
    const transformer = createDayTransformer([
      [0, 1],
      [1, 2],
      [2, 0],
    ]);

    const encoded = transformer.encode({ days: 7 }); // bits 0,1,2
    const decoded = transformer.decode(encoded);
    expect(decoded.days).toBe(7);
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
    expect(transformer.decode({ days: 0b00000001 }).days).toBe(1 << 6); // 0b1000000
    // And the reverse: encoding internal Sunday should set device bit 0
    expect(transformer.encode({ days: 1 << 6 }).days).toBe(0b00000001);
  });

  it('preserves other fields in entry', () => {
    const transformer = createDayTransformer([
      [0, 1],
      [1, 0],
    ]);
    const entry = { hour: 8, minute: 30, portion: 6, days: 1 };
    const encoded = transformer.encode(entry);
    expect(encoded).toEqual({ hour: 8, minute: 30, portion: 6, days: 2 });

    const decoded = transformer.decode(encoded);
    expect(decoded).toEqual(entry);
  });
});

describe('DictEncoder', () => {
  const encoder = getEncoder({
    manufacturer: 'Test',
    models: [],
    fields: [],
    encodingType: EncodingType.DICT,
    encodingTemplate: '',
  });

  it('encodes feeding times as JSON with portion->size mapping', () => {
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 2, days: 127, enabled: 1 },
      { hour: 18, minute: 30, portion: 1, days: 62, enabled: 1 },
    ];
    const encoded = encoder.encode(feedingTimes);
    const parsed = JSON.parse(encoded);

    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({
      hour: 8,
      minute: 0,
      portion: 2,
      days: 127,
      enabled: 1,
    });
  });

  it('decodes JSON with size->portion mapping', () => {
    const deviceData = [
      { hour: 8, minute: 0, size: 2, days: 127, enabled: 1 },
      { hour: 18, minute: 30, size: 1, days: 62, enabled: 1 },
    ];
    const decoded = encoder.decode(JSON.stringify(deviceData));

    expect(decoded).toEqual([
      { hour: 8, minute: 0, size: 2, days: 127, enabled: 1 },
      { hour: 18, minute: 30, size: 1, days: 62, enabled: 1 },
    ]);
  });

  it('returns empty array for unknown/empty data', () => {
    expect(encoder.decode('unknown')).toEqual([]);
    expect(encoder.decode('')).toEqual([]);
    expect(encoder.decode('{"key": "value"}')).toEqual([]);
  });

  it('throws error for invalid JSON', () => {
    expect(() => encoder.decode('not valid json')).toThrow(
      'Invalid JSON data for DICT encoding',
    );
  });

  it('encodes empty array', () => {
    expect(encoder.encode([])).toBe('[]');
  });

  it('applies day transformer through encode/decode functions', () => {
    const transformer = createStringDayTransformer({
      127: 'everyday',
      31: 'workdays',
    });
    const aqaraEncoder = getEncoder({
      manufacturer: 'Aqara',
      models: ['C1'],
      fields: [],
      encodingType: EncodingType.DICT,
      encodingTemplate: '',
      encode: (data: any[]) => data.map((e) => transformer.encode(e)),
      decode: (data: any) =>
        Array.isArray(data) ? data.map((e) => transformer.decode(e)) : data,
    });

    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, portion: 6, days: 127 },
      { hour: 16, minute: 0, portion: 6, days: 31 },
    ];

    const encoded = aqaraEncoder.encode(feedingTimes);
    const parsed = JSON.parse(encoded);

    expect(parsed[0].days).toBe('everyday');
    expect(parsed[1].days).toBe('workdays');

    const decoded = aqaraEncoder.decode(encoded);
    expect(decoded[0].days).toBe(127);
    expect(decoded[1].days).toBe(31);
  });
});

describe('createStringDayTransformer', () => {
  const transformer = createStringDayTransformer({
    127: 'everyday',
    31: 'workdays',
    96: 'weekend',
    1: 'mon',
  });

  it('encodes bitmask to string when mapped', () => {
    expect(transformer.encode({ days: 127 }).days).toBe('everyday');
    expect(transformer.encode({ days: 31 }).days).toBe('workdays');
    expect(transformer.encode({ days: 96 }).days).toBe('weekend');
    expect(transformer.encode({ days: 1 }).days).toBe('mon');
  });

  it('passes through unmapped values', () => {
    expect(transformer.encode({ days: 15 }).days).toBe(15);
    expect(transformer.encode({ days: 63 }).days).toBe(63);
    expect(transformer.decode({ days: 15 }).days).toBe(15);
    expect(transformer.decode({ days: 63 }).days).toBe(63);
  });

  it('decodes string to bitmask when mapped', () => {
    expect(transformer.decode({ days: 'everyday' }).days).toBe(127);
    expect(transformer.decode({ days: 'workdays' }).days).toBe(31);
    expect(transformer.decode({ days: 'weekend' }).days).toBe(96);
    expect(transformer.decode({ days: 'mon' }).days).toBe(1);
  });

  it('roundtrip preserves values', () => {
    expect(transformer.decode(transformer.encode({ days: 127 })).days).toBe(
      127,
    );
    expect(transformer.decode(transformer.encode({ days: 31 })).days).toBe(31);
  });

  it('handles Aqara complex day patterns', () => {
    const aqaraTransformer = createStringDayTransformer({
      127: 'everyday',
      85: 'mon-wed-fri-sun',
      42: 'tue-thu-sat',
    });

    expect(aqaraTransformer.encode({ days: 85 }).days).toBe('mon-wed-fri-sun');
    expect(aqaraTransformer.decode({ days: 'mon-wed-fri-sun' }).days).toBe(85);
    expect(aqaraTransformer.encode({ days: 42 }).days).toBe('tue-thu-sat');
    expect(aqaraTransformer.decode({ days: 'tue-thu-sat' }).days).toBe(42);
  });

  it('preserves other fields in entry', () => {
    const entry = { hour: 8, minute: 30, portion: 6, days: 127 };
    const encoded = transformer.encode(entry);
    expect(encoded).toEqual({
      hour: 8,
      minute: 30,
      portion: 6,
      days: 'everyday',
    });

    const decoded = transformer.decode(encoded);
    expect(decoded).toEqual(entry);
  });
});

import { describe, it, expect } from 'vitest';
import {
  parseTemplate,
  chunkLength,
  getEncoder,
  EncodingType,
} from '../../src/profiles/serializer';
import { f, TemplateFieldName as F, formatHourMinute } from '../../src/types';
import { FeedingTime } from '../../src/types';

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
    fields: [],
    profiles: [],
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
      fields: [],
      profiles: [],
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.DAYS, 2)}${f(F.PORTION, 2)}${f(F.ENABLED, 1)}`,
    });
    const feedingTimes: FeedingTime[] = [
      { hour: 8, minute: 0, days: 0b0111110, portion: 2, enabled: 1 },
      { hour: 10, minute: 0, days: 0b1000001, portion: 1, enabled: 0 },
    ];
    const encoded = encoder2.encode(feedingTimes);
    const decoded = encoder2.decode(encoded);
    expect(decoded).toEqual(feedingTimes);
  });
});

describe('encoder error handling', () => {
  it('throws on invalid base64', () => {
    const encoder = getEncoder({
      fields: [],
      profiles: [],
      encodingTemplate: f(F.HOUR, 2),
    });
    expect(() => encoder.decode('!@#$')).toThrow('Invalid base64');
  });

  it('throws on invalid profile', () => {
    expect(() =>
      getEncoder({
        fields: [],
        profiles: [],
        encodingTemplate: undefined as any,
      }),
    ).toThrow('Invalid device profile for encoding/decoding');
  });

  it('throws on invalid meal plan length', () => {
    const encoder = getEncoder({
      fields: [],
      profiles: [],
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.MINUTE, 2)}${f(F.PORTION, 2)}`,
    });
    expect(() => encoder.decode('AAA=')).toThrow(
      'Invalid templated meal plan length',
    );
  });
});

describe('formatHourMinute', () => {
  it('formats valid hour/minute', () => {
    expect(formatHourMinute(8, 5)).toBe('08:05');
    expect(formatHourMinute(23, 59)).toBe('23:59');
  });

  it('returns --:-- for invalid input', () => {
    expect(formatHourMinute(undefined, 0)).toBe('--:--');
    expect(formatHourMinute(8, undefined)).toBe('--:--');
    expect(formatHourMinute(NaN, 0)).toBe('--:--');
    expect(formatHourMinute(-1, 0)).toBe('--:--');
    expect(formatHourMinute(8, 60)).toBe('--:--');
  });
});

describe('TemplateEncoder edge cases', () => {
  it('handles null/undefined values by padding with zeros', () => {
    const encoder = getEncoder({
      fields: [],
      profiles: [],
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
      fields: [],
      profiles: [],
      encodingType: EncodingType.HEX,
      encodingTemplate: `${f(F.HOUR, 2)}${f(F.FILL, 2)}`,
    });
    const result = encoder.encode([{ hour: 8 }]);
    expect(result).toBe('0800');
  });
});

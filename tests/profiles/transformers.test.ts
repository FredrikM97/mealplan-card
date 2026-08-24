import { describe, it, expect } from 'vitest';
import {
  combineTransformers,
  createDayTransformer,
  createDictEncoderWithWrapper,
  createFieldMapTransformer,
  createPackedTimeTransformer,
  createStringDayTransformer,
} from '../../src/profiles/transformers';
import type { FeedingTimeWithStringDays } from '../../src/types';

describe('createDayTransformer', () => {
  const days = createDayTransformer([
    [0, 6], // Mon
    [1, 5], // Tue
  ]);

  it('remaps internal day bits to device bits on encode', () => {
    // internal bits 0+1 (Mon+Tue) -> device bits 6+5
    expect(days.encode({ days: 0b0000011 })).toEqual({ days: 0b1100000 });
  });

  it('remaps device day bits to internal bits on decode', () => {
    expect(days.decode({ days: 0b1100000 })).toEqual({ days: 0b0000011 });
  });

  it('handles arrays of entries', () => {
    expect(days.encode([{ days: 1 }])).toEqual([{ days: 1 << 6 }]);
  });

  it('passes through entries without days', () => {
    const entry = { hour: 8 };
    expect(days.encode(entry)).toEqual(entry);
    expect(days.decode(entry)).toEqual(entry);
  });
});

describe('createPackedTimeTransformer', () => {
  const time = createPackedTimeTransformer();

  it('packs hour/minute into a big-endian minutes-since-midnight pair', () => {
    expect(time.encode({ hour: 10, minute: 8 })).toEqual({
      hour: 0x02,
      minute: 0x60,
    });
  });

  it('unpacks a big-endian minutes-since-midnight pair into hour/minute', () => {
    expect(time.decode({ hour: 0x02, minute: 0x60 })).toEqual({
      hour: 10,
      minute: 8,
    });
  });

  it('handles arrays of entries', () => {
    expect(time.encode([{ hour: 20, minute: 0 }])).toEqual([
      { hour: 0x04, minute: 0xb0 },
    ]);
  });

  it('passes through entries without hour/minute', () => {
    const entry = { portion: 2 };
    expect(time.encode(entry)).toEqual(entry);
    expect(time.decode(entry)).toEqual(entry);
  });
});

describe('combineTransformers', () => {
  it('applies steps left-to-right on encode and right-to-left on decode', () => {
    const combined = combineTransformers([
      createPackedTimeTransformer(),
      createDayTransformer([[0, 6]]), // Mon only
    ]);

    const encoded = combined.encode({ hour: 10, minute: 8, days: 1 });
    expect(encoded).toEqual({ hour: 0x02, minute: 0x60, days: 1 << 6 });

    const decoded = combined.decode(encoded as never);
    expect(decoded).toEqual({ hour: 10, minute: 8, days: 1 });
  });

  it('chains steps with mismatched shapes (array -> string-day entries -> wrapped dict)', () => {
    const combined = combineTransformers([
      createStringDayTransformer({ 127: 'everyday' }),
      createFieldMapTransformer({ portion: 'size' }),
      createDictEncoderWithWrapper('schedule'),
    ]);

    const encoded = combined.encode([{ hour: 8, portion: 2, days: 127 }]);
    expect(encoded).toEqual({
      schedule: [{ hour: 8, size: 2, days: 'everyday' }],
    });

    const decoded = combined.decode(encoded as never);
    expect(decoded).toEqual([{ hour: 8, portion: 2, days: 127 }]);
  });
});

describe('createStringDayTransformer', () => {
  const stringDays = createStringDayTransformer({
    127: 'everyday',
    1: 'mon',
  });

  it('maps a known bitmask to its string value on encode', () => {
    expect(stringDays.encode({ days: 127 })).toEqual({ days: 'everyday' });
  });

  it('leaves unknown bitmasks as-is on encode', () => {
    expect(stringDays.encode({ days: 2 })).toEqual({ days: 2 });
  });

  it('maps a known string value back to its bitmask on decode', () => {
    const entry = { days: 'mon' } as unknown as FeedingTimeWithStringDays;
    expect(stringDays.decode(entry)).toEqual({ days: 1 });
  });

  it('leaves unknown string values as-is on decode', () => {
    const entry = { days: 'weekend' } as unknown as FeedingTimeWithStringDays;
    expect(stringDays.decode(entry)).toEqual({ days: 'weekend' });
  });

  it('passes through entries without days', () => {
    const entry = { hour: 8 };
    expect(stringDays.encode(entry)).toEqual(entry);
    expect(stringDays.decode(entry)).toEqual(entry);
  });
});

describe('createFieldMapTransformer', () => {
  const fieldMap = createFieldMapTransformer({ portion: 'size' });

  it('renames internal fields to device fields on encode', () => {
    expect(fieldMap.encode({ portion: 2 })).toEqual({ size: 2 });
  });

  it('renames device fields back to internal fields on decode', () => {
    expect(fieldMap.decode({ size: 2 } as never)).toEqual({ portion: 2 });
  });

  it('leaves unmapped fields untouched', () => {
    expect(fieldMap.encode({ hour: 8 })).toEqual({ hour: 8 });
  });

  it('drops null-valued fields', () => {
    expect(fieldMap.encode({ portion: 2, hour: null as never })).toEqual({
      size: 2,
    });
  });
});

describe('createDictEncoderWithWrapper', () => {
  it('wraps entries under the given key on encode', () => {
    const wrapper = createDictEncoderWithWrapper('schedule');
    expect(wrapper.encode([{ hour: 8, portion: 2 }])).toEqual({
      schedule: [{ hour: 8, portion: 2 }],
    });
  });

  it('wraps a single (non-array) entry under the given key on encode', () => {
    const wrapper = createDictEncoderWithWrapper('schedule');
    expect(wrapper.encode({ hour: 8, portion: 2 })).toEqual({
      schedule: [{ hour: 8, portion: 2 }],
    });
  });

  it('unwraps entries from the given key on decode', () => {
    const wrapper = createDictEncoderWithWrapper('schedule');
    const result = wrapper.decode({ schedule: [{ hour: 8, portion: 2 }] });
    expect(result).toEqual([{ hour: 8, portion: 2 }]);
  });

  it('accepts a plain array (not wrapped in the key) on decode', () => {
    const wrapper = createDictEncoderWithWrapper('schedule');
    const result = wrapper.decode([{ hour: 8, portion: 2 }]);
    expect(result).toEqual([{ hour: 8, portion: 2 }]);
  });

  it('returns an empty array when the wrap key is missing on decode', () => {
    const wrapper = createDictEncoderWithWrapper('schedule');
    expect(wrapper.decode({})).toEqual([]);
  });
});

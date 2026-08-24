import type {
  EncodedFeedingData,
  FeedingTime,
  JsonObject,
  ProfileTransformer,
} from '../types';

type FeedingTimeTransformer = {
  encode: (data: FeedingTime | FeedingTime[]) => FeedingTime | FeedingTime[];
  decode: (
    data: FeedingTime | FeedingTime[] | JsonObject,
  ) => FeedingTime | FeedingTime[];
};

type EntryCodec = {
  encodeEntry: (entry: FeedingTime) => FeedingTime;
  decodeEntry: (entry: FeedingTime) => FeedingTime;
};

/**
 * Combines a profile's `transformers` pipeline into one encode/decode pair, applying encode
 * left-to-right and decode right-to-left. Steps don't need matching input/output shapes
 * (e.g. FeedingTime[] -> string-day entries -> wrapped dict).
 */
export function combineTransformers(transformers: ProfileTransformer[]): {
  encode: (data: FeedingTime | FeedingTime[]) => EncodedFeedingData;
  decode: (data: JsonObject) => FeedingTime | FeedingTime[];
} {
  return {
    encode: (data) =>
      transformers.reduce(
        (acc, transformer) => transformer.encode(acc as never),
        data as unknown,
      ) as EncodedFeedingData,
    decode: (data) =>
      transformers.reduceRight(
        (acc, transformer) => transformer.decode(acc as never),
        data as unknown,
      ) as FeedingTime | FeedingTime[],
  };
}

/**
 * Turns a "build single-entry encode/decode" function into a full transformer factory that
 * also handles arrays, so day remap/time packing/etc. only need to define their entry logic
 * once instead of each ending with `wrapEntryTransformer(encodeEntry, decodeEntry)`.
 */
const createEntryTransformer =
  <TArgs extends unknown[]>(build: (...args: TArgs) => EntryCodec) =>
  (...args: TArgs): FeedingTimeTransformer => {
    const { encodeEntry, decodeEntry } = build(...args);
    return {
      encode: (data) =>
        Array.isArray(data) ? data.map(encodeEntry) : encodeEntry(data),
      decode: (data) =>
        Array.isArray(data)
          ? (data as FeedingTime[]).map(decodeEntry)
          : decodeEntry(data as FeedingTime),
    };
  };

/**
 * Creates day transformer with custom bit mapping.
 *
 * @param map - Array of [internalBit, deviceBit] tuples.
 *   Internal format: bit 0 (rightmost) = Monday, bit 1 = Tuesday ... bit 6 (leftmost) = Sunday
 *
 * Bit positions use standard binary notation:
 *   - bit 0 is the rightmost/LSB (least significant bit)
 *   - bit 6 is the leftmost/MSB (most significant bit)
 *   - Example: 0b0000011 has bits 0 and 1 set (Mon+Tue)
 */
export const createDayTransformer = createEntryTransformer(
  (map: [number, number][]) => {
    const encodeEntry = (entry: FeedingTime): FeedingTime => {
      if (entry.days === undefined) return entry;
      let encoded = 0;
      map.forEach(([std, custom]) => {
        if (entry.days! & (1 << std)) {
          encoded |= 1 << custom;
        }
      });
      return { ...entry, days: encoded & 0x7f };
    };

    const decodeEntry = (entry: FeedingTime): FeedingTime => {
      if (entry.days === undefined) return entry;
      let standardDays = 0;
      const maskedEncoded = entry.days & 0x7f;
      map.forEach(([std, custom]) => {
        if (maskedEncoded & (1 << custom)) {
          standardDays |= 1 << std;
        }
      });
      return { ...entry, days: standardDays };
    };

    return { encodeEntry, decodeEntry };
  },
);

/**
 * Creates a transformer that packs/unpacks a big-endian 16-bit "minutes since midnight"
 * value split across the HOUR/MINUTE byte slots, for devices that don't store literal
 * hour/minute bytes.
 */
export const createPackedTimeTransformer = createEntryTransformer(() => {
  const encodeEntry = (entry: FeedingTime): FeedingTime => {
    if (entry.hour === undefined || entry.minute === undefined) return entry;
    const totalMinutes = entry.hour * 60 + entry.minute;
    return {
      ...entry,
      hour: (totalMinutes >> 8) & 0xff,
      minute: totalMinutes & 0xff,
    };
  };

  const decodeEntry = (entry: FeedingTime): FeedingTime => {
    if (entry.hour === undefined || entry.minute === undefined) return entry;
    const totalMinutes = (entry.hour << 8) | entry.minute;
    return {
      ...entry,
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  };

  return { encodeEntry, decodeEntry };
});

/**
 * Creates a string-based day transformer for devices that use string values like "everyday".
 *
 * @param stringMap - Map of bitmask values to string representations
 * @returns Transformer with encode/decode functions that transform the days field in entries
 */
export const createStringDayTransformer = createEntryTransformer(
  (stringMap: Record<number, string>) => {
    const reverseMap: Record<string, number> = {};
    Object.entries(stringMap).forEach(([bitmask, str]) => {
      reverseMap[str] = parseInt(bitmask, 10);
    });

    const encodeEntry = (entry: FeedingTime): FeedingTime => {
      if (entry.days === undefined) return entry;
      const mappedDays =
        stringMap[entry.days] !== undefined
          ? stringMap[entry.days]
          : entry.days;
      return { ...entry, days: mappedDays } as unknown as FeedingTime;
    };

    const decodeEntry = (entry: FeedingTime): FeedingTime => {
      const days = entry.days as unknown as string | number | undefined;
      if (days === undefined) return entry;
      const mappedDays =
        typeof days === 'string' && reverseMap[days] !== undefined
          ? reverseMap[days]
          : days;
      return { ...entry, days: mappedDays as number };
    };

    return { encodeEntry, decodeEntry };
  },
);

/**
 * Creates a transformer that renames fields between the internal shape and a device's field
 * names (e.g. internal 'portion' <-> device 'size'), reversing the mapping on decode.
 */
export const createFieldMapTransformer = createEntryTransformer(
  (fieldMap: Record<string, string>) => {
    const reverseFieldMap = Object.fromEntries(
      Object.entries(fieldMap).map(([internal, device]) => [device, internal]),
    );

    const renameFields = (
      entry: Record<string, unknown>,
      mapping: Record<string, string>,
    ): Record<string, unknown> => {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(entry)) {
        if (value !== null) {
          result[mapping[key] ?? key] = value;
        }
      }
      return result;
    };

    const encodeEntry = (entry: FeedingTime): FeedingTime =>
      renameFields(entry as Record<string, unknown>, fieldMap) as FeedingTime;

    const decodeEntry = (entry: FeedingTime): FeedingTime =>
      renameFields(
        entry as Record<string, unknown>,
        reverseFieldMap,
      ) as FeedingTime;

    return { encodeEntry, decodeEntry };
  },
);

/**
 * Wraps an array of entries under a JSON key on encode, and unwraps it on decode.
 * Usage: transformers: [createStringDayTransformer({...}), createFieldMapTransformer({...}), createDictEncoderWithWrapper('schedule')]
 */
export function createDictEncoderWithWrapper(wrapKey: string): {
  encode: (data: FeedingTime | FeedingTime[]) => Record<string, unknown>;
  decode: (data: JsonObject) => FeedingTime | FeedingTime[];
} {
  return {
    encode: (data) => ({
      [wrapKey]: Array.isArray(data) ? data : [data],
    }),
    decode: (data) => {
      const container = data as Record<string, FeedingTime[]> | FeedingTime[];
      const entries = Array.isArray(container) ? container : container[wrapKey];
      return Array.isArray(entries) ? entries : [];
    },
  };
}

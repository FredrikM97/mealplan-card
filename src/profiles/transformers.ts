import type {
  FeedingTime,
  FeedingTimeWithStringDays,
  JsonObject,
} from '../types';

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
export const createDayTransformer = (map: [number, number][]) => {
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
    const e = entry;
    if (e.days === undefined) return entry;
    let standardDays = 0;
    const maskedEncoded = e.days & 0x7f;
    map.forEach(([std, custom]) => {
      if (maskedEncoded & (1 << custom)) {
        standardDays |= 1 << std;
      }
    });
    return { ...e, days: standardDays };
  };

  return {
    encode: (
      data: FeedingTime | FeedingTime[],
    ): FeedingTime | FeedingTime[] => {
      return Array.isArray(data) ? data.map(encodeEntry) : encodeEntry(data);
    },
    decode: (
      data: FeedingTime | FeedingTime[] | JsonObject,
    ): FeedingTime | FeedingTime[] => {
      if (Array.isArray(data)) return (data as FeedingTime[]).map(decodeEntry);
      return decodeEntry(data as FeedingTime);
    },
  };
};

/**
 * Creates a string-based day transformer for devices that use string values like "everyday".
 *
 * @param stringMap - Map of bitmask values to string representations
 * @returns Transformer with encode/decode functions that transform the days field in entries
 */
export const createStringDayTransformer = (
  stringMap: Record<number, string>,
) => {
  // Create reverse map for decoding
  const reverseMap: Record<string, number> = {};
  Object.entries(stringMap).forEach(([bitmask, str]) => {
    reverseMap[str] = parseInt(bitmask, 10);
  });

  return {
    encode: (entry: FeedingTime): FeedingTimeWithStringDays => {
      if (entry.days === undefined) return entry as FeedingTimeWithStringDays;
      const mappedDays =
        stringMap[entry.days] !== undefined
          ? stringMap[entry.days]
          : entry.days;
      return { ...entry, days: mappedDays } as FeedingTimeWithStringDays;
    },
    decode: (entry: FeedingTimeWithStringDays): FeedingTime => {
      if (entry.days === undefined) return entry;
      const mappedDays =
        typeof entry.days === 'string' && reverseMap[entry.days] !== undefined
          ? reverseMap[entry.days]
          : entry.days;
      return { ...entry, days: mappedDays as number };
    },
  };
};

/**
 * Wraps day transformer with JSON key wrapping and field mapping
 * Usage: ...createDictEncoderWithWrapper('schedule', createStringDayTransformer({...}), {'portions[0]': 'size'})
 */
export function createDictEncoderWithWrapper(
  wrapKey: string,
  dayTransformer?: {
    encode?: (v: FeedingTime) => FeedingTimeWithStringDays;
    decode?: (
      v: FeedingTimeWithStringDays | Record<string, unknown>,
    ) => FeedingTime | Record<string, unknown>;
  },
  fieldMap?: Record<string, string>,
): {
  encode?: (data: FeedingTime | FeedingTime[]) => Record<string, unknown>;
  decode?: (data: JsonObject) => FeedingTime | FeedingTime[];
} {
  const reverseMap = fieldMap
    ? Object.fromEntries(Object.entries(fieldMap).map(([k, v]) => [v, k]))
    : undefined;

  const mapFields = (
    entry: Record<string, unknown>,
    mapping?: Record<string, string>,
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    const parseIndexedField = (
      field: string,
    ): { base: string; index: number } | null => {
      const match = field.match(/^([^\[]+)\[(\d+)\]$/);
      if (!match) return null;
      const base = match[1];
      const indexStr = match[2];
      if (!indexStr) return null;
      const index = parseInt(indexStr, 10);
      if (!base || Number.isNaN(index)) return null;
      return { base, index };
    };

    const getValue = (field: string): unknown => {
      const indexed = parseIndexedField(field);
      if (!indexed) return entry[field];
      const arr = entry[indexed.base];
      return Array.isArray(arr) ? arr[indexed.index] : undefined;
    };

    const setValue = (field: string, value: unknown) => {
      const indexed = parseIndexedField(field);
      if (!indexed) {
        result[field] = value;
        return;
      }
      const arr = Array.isArray(result[indexed.base])
        ? (result[indexed.base] as unknown[])
        : [];
      arr[indexed.index] = value;
      result[indexed.base] = arr;
    };

    const mappedBaseFields = new Set<string>();
    if (mapping) {
      for (const [source, target] of Object.entries(mapping)) {
        const value = getValue(source);
        if (value !== null && value !== undefined) {
          setValue(target, value);
        }
        const indexed = parseIndexedField(source);
        if (indexed) {
          mappedBaseFields.add(indexed.base);
        }
      }
    }

    for (const [key, value] of Object.entries(entry)) {
      if (value === null) continue;
      if (mapping?.[key]) continue;
      if (mappedBaseFields.has(key)) continue;
      result[key] = value;
    }
    return result;
  };

  return {
    encode: (data: FeedingTime | FeedingTime[]) => {
      const dataArray = Array.isArray(data) ? data : [data];
      return {
        [wrapKey]: dataArray.map((e) => {
          const transformed = dayTransformer?.encode
            ? dayTransformer.encode(e)
            : e;
          return mapFields(
            transformed as Record<string, unknown>,
            fieldMap,
          ) as FeedingTime;
        }),
      };
    },
    decode: (data: JsonObject): FeedingTime | FeedingTime[] => {
      const obj = data as Record<string, FeedingTime[]> | FeedingTime[];
      const array = Array.isArray(obj) ? obj : obj[wrapKey];
      return Array.isArray(array)
        ? array.map((e) => {
            const mapped = mapFields(e as Record<string, unknown>, reverseMap);
            return dayTransformer?.decode
              ? dayTransformer.decode(mapped)
              : mapped;
          })
        : [];
    },
  };
}

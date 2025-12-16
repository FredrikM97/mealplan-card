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
export const createDayTransformer = (map: [number, number][]) => ({
  encode: (entry: any) => {
    if (entry.days === undefined) return entry;
    let encoded = 0;
    map.forEach(([std, custom]) => {
      if (entry.days & (1 << std)) {
        encoded |= 1 << custom;
      }
    });
    return { ...entry, days: encoded & 0x7f };
  },
  decode: (entry: any) => {
    if (entry.days === undefined) return entry;
    let standardDays = 0;
    const maskedEncoded = entry.days & 0x7f;
    map.forEach(([std, custom]) => {
      if (maskedEncoded & (1 << custom)) {
        standardDays |= 1 << std;
      }
    });
    return { ...entry, days: standardDays };
  },
});

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
    encode: (entry: any) => {
      if (entry.days === undefined) return entry;
      const mappedDays =
        stringMap[entry.days] !== undefined
          ? stringMap[entry.days]
          : entry.days;
      return { ...entry, days: mappedDays };
    },
    decode: (entry: any) => {
      if (entry.days === undefined) return entry;
      const mappedDays =
        typeof entry.days === 'string' && reverseMap[entry.days] !== undefined
          ? reverseMap[entry.days]
          : entry.days;
      return { ...entry, days: mappedDays };
    },
  };
};

/**
 * Wraps day transformer with JSON key wrapping and field mapping
 * Usage: ...createDictEncoderWithWrapper('schedule', createStringDayTransformer({...}), {portion: 'size'})
 */
export function createDictEncoderWithWrapper(
  wrapKey: string,
  dayTransformer?: { encode?: (v: any) => any; decode?: (v: any) => any },
  fieldMap?: Record<string, string>,
): {
  encode?: (data: any) => any;
  decode?: (data: any) => any;
} {
  const reverseMap = fieldMap
    ? Object.fromEntries(Object.entries(fieldMap).map(([k, v]) => [v, k]))
    : undefined;

  const mapFields = (entry: any, mapping?: Record<string, string>) => {
    const result: any = {};
    for (const [key, value] of Object.entries(entry)) {
      if (value !== null) {
        result[mapping?.[key] ?? key] = value;
      }
    }
    return result;
  };

  return {
    encode: (data: any[]) => ({
      [wrapKey]: data.map((e) => {
        const transformed = dayTransformer?.encode
          ? dayTransformer.encode(e)
          : e;
        return mapFields(transformed, fieldMap);
      }),
    }),
    decode: (data: any) => {
      const array = data[wrapKey] ?? data;
      return Array.isArray(array)
        ? array.map((e) => {
            const mapped = mapFields(e, reverseMap);
            return dayTransformer?.decode
              ? dayTransformer.decode(mapped)
              : mapped;
          })
        : array;
    },
  };
}

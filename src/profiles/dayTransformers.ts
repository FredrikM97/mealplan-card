/**
 * Day transformation utilities for devices with non-standard day encoding.
 *
 * Standard bitmask: bit 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
 */

/**
 * Creates encode/decode functions from a day mapping array.
 * @param map Array of [standardBit, customBit] tuples
 * @returns Object with encode and decode functions
 */
export const createDayTransformer = (map: number[][]) => ({
  encode: (standardDays: number) => {
    let encoded = 0;
    map.forEach(([std, custom]) => {
      if (standardDays & (1 << std)) encoded |= 1 << custom;
    });
    return encoded;
  },
  decode: (encoded: number) => {
    let standardDays = 0;
    map.forEach(([std, custom]) => {
      if (encoded & (1 << custom)) standardDays |= 1 << std;
    });
    return standardDays;
  },
});

/**
 * Puppy Kitty day transformer configuration.
 * Puppy Kitty uses a non-standard day bit order:
 * Standard: bit 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
 * Puppy Kitty: bit 0=Sat, 1=Fri, 2=Thu, 3=Wed, 4=Mon, 5=Tue, 6=Sun
 */
export const puppyKittyDayTransformer = createDayTransformer([
  [5, 0], // Sat
  [4, 1], // Fri
  [3, 2], // Thu
  [2, 3], // Wed
  [0, 4], // Mon
  [1, 5], // Tue
  [6, 6], // Sun
]);

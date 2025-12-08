import { describe, it, expect } from 'vitest';
import { profiles } from '../../src/profiles/profiles';
import { getEncoder } from '../../src/profiles/serializer';

describe('Custom day transformers', () => {
  const puppyKittyProfile = profiles.find((p) =>
    p.profiles.some((prof) => prof.manufacturer === 'Puppy Kitty'),
  );

  it('Puppy Kitty: encodes Saturday correctly', () => {
    if (!puppyKittyProfile) throw new Error('Puppy Kitty profile not found');

    const encoder = getEncoder(puppyKittyProfile);

    // Standard bitmask: Mon=bit0, Tue=bit1, Wed=bit2, Thu=bit3, Fri=bit4, Sat=bit5, Sun=bit6
    // Test Saturday only (bit 5 = 0b0100000 = 32)
    const saturdayOnly = [
      { hour: 8, minute: 0, portion: 2, days: 0b0100000, enabled: 1 },
    ];
    const encoded = encoder.encode(saturdayOnly);
    // Puppy Kitty uses decimal encoding: DAYS(hex2) HOUR(dec2) MINUTE(dec2) PORTION(dec1) ENABLED(dec1)
    // Expected: 01 (days in hex) 08 (hour) 00 (minute) 2 (portion) 1 (enabled)
    expect(encoded).toBe('01080021');
  });

  it('Puppy Kitty: encodes all days correctly', () => {
    if (!puppyKittyProfile) throw new Error('Puppy Kitty profile not found');

    const encoder = getEncoder(puppyKittyProfile);

    // All days: 0b1111111 = 127
    const allDays = [
      { hour: 12, minute: 30, portion: 3, days: 0b1111111, enabled: 1 },
    ];
    const encoded = encoder.encode(allDays);
    // Puppy Kitty encoding for all days: 1+2+4+8+16+32+64 = 127 = 0x7F
    // Expected: 7F (days hex) 12 (hour dec) 30 (minute dec) 3 (portion) 1 (enabled)
    expect(encoded).toBe('7f123031');
  });

  it('Puppy Kitty: decodes days correctly', () => {
    if (!puppyKittyProfile) throw new Error('Puppy Kitty profile not found');

    const encoder = getEncoder(puppyKittyProfile);

    // Decode where Puppy Kitty has Saturday (bit 0 = value 1)
    // 01 (days=Saturday) 08 (hour) 00 (minute) 2 (portion) 1 (enabled)
    const decoded = encoder.decode('01080021');
    expect(decoded.length).toBe(1);
    expect(decoded[0].days).toBe(0b0100000); // Saturday = bit 5
    expect(decoded[0].hour).toBe(8);
    expect(decoded[0].minute).toBe(0);
    expect(decoded[0].portion).toBe(2);
    expect(decoded[0].enabled).toBe(1);
  });

  it('Puppy Kitty: encodes Monday, Tuesday, Wednesday correctly', () => {
    if (!puppyKittyProfile) throw new Error('Puppy Kitty profile not found');

    const encoder = getEncoder(puppyKittyProfile);

    // Mon=bit0, Tue=bit1, Wed=bit2 → 0b0000111 = 7
    const monTueWed = [
      { hour: 9, minute: 15, portion: 1, days: 0b0000111, enabled: 1 },
    ];
    const encoded = encoder.encode(monTueWed);
    // Puppy Kitty: Mon=16, Tue=32, Wed=8 → 16+32+8 = 56 = 0x38
    // Expected: 38 (days hex) 09 (hour dec) 15 (minute dec) 1 (portion) 1 (enabled)
    expect(encoded).toBe('38091511');
  });

  it('Puppy Kitty: round-trips encoding and decoding', () => {
    if (!puppyKittyProfile) throw new Error('Puppy Kitty profile not found');

    const encoder = getEncoder(puppyKittyProfile);

    const original = [
      { hour: 7, minute: 30, portion: 2, days: 0b1010101, enabled: 1 },
      { hour: 18, minute: 0, portion: 3, days: 0b0101010, enabled: 0 },
    ];

    const encoded = encoder.encode(original);
    const decoded = encoder.decode(encoded);

    expect(decoded).toEqual(original);
  });
});

import type { DeviceProfile, FeedingTime } from '../types';
import { TOKEN_REGEX, TemplateFieldName, HEX_FIELDS } from '../types';

export interface TemplateToken {
  name: string;
  length: number;
}

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
  encode: (standardDays: number) => {
    let encoded = 0;
    map.forEach(([std, custom]) => {
      if (standardDays & (1 << std)) {
        encoded |= 1 << custom;
      }
    });
    const result = encoded & 0x7f;
    return result;
  },
  decode: (encoded: number) => {
    let standardDays = 0;
    const maskedEncoded = encoded & 0x7f;
    map.forEach(([std, custom]) => {
      if (maskedEncoded & (1 << custom)) {
        standardDays |= 1 << std;
      }
    });
    return standardDays;
  },
});

/**
 * Creates a string-based day transformer for devices that use string values like "everyday".
 * 
 * @param stringMap - Map of bitmask values to string representations
 * @returns Transformer with encode/decode functions
 */
export const createStringDayTransformer = (stringMap: Record<number, string>) => {
  // Create reverse map for decoding
  const reverseMap: Record<string, number> = {};
  Object.entries(stringMap).forEach(([bitmask, str]) => {
    reverseMap[str] = parseInt(bitmask, 10);
  });

  return {
    encode: (standardDays: number) => {
      // Convert bitmask to string if mapping exists, otherwise return number
      return stringMap[standardDays] !== undefined 
        ? (stringMap[standardDays] as any) 
        : standardDays;
    },
    decode: (encoded: any) => {
      // Convert string to bitmask if mapping exists, otherwise return as number
      return typeof encoded === 'string' && reverseMap[encoded] !== undefined
        ? reverseMap[encoded]
        : (encoded as number);
    },
  };
};

function validateTemplateInput(template: string): void {
  if (!template || typeof template !== 'string') {
    throw new Error('Invalid template');
  }
}

function validateTokenPosition(
  matchIndex: number,
  expectedIndex: number,
): void {
  if (matchIndex !== expectedIndex) {
    throw new Error('Invalid template: unexpected characters between tokens');
  }
}

function parseTokenLength(lengthStr: string): number {
  const len = parseInt(lengthStr, 10);
  if (!Number.isInteger(len) || len <= 0) {
    throw new Error('Invalid token length');
  }
  return len;
}

export function parseTemplate(template: string): TemplateToken[] {
  validateTemplateInput(template);

  const tokens: TemplateToken[] = [];
  TOKEN_REGEX.lastIndex = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(template)) !== null) {
    validateTokenPosition(match.index, lastIndex);

    const name = match[1];
    const lengthStr = match[2];
    if (!name || !lengthStr) {
      throw new Error('Invalid token format in template');
    }
    const length = parseTokenLength(lengthStr);

    tokens.push({ name, length });
    lastIndex = TOKEN_REGEX.lastIndex;
  }

  if (lastIndex !== template.length) {
    throw new Error('Invalid template: tokens must exactly cover template');
  }

  return tokens;
}

export function chunkLength(tokens: TemplateToken[]): number {
  return tokens.reduce((acc, t) => acc + t.length, 0);
}

export class TemplateEncoder {
  private tokens: TemplateToken[];
  private profile: DeviceProfile;
  private chunkLen: number;

  constructor(template: string, profile: DeviceProfile) {
    if (!template) throw new Error('Template is required');
    this.tokens = parseTemplate(template);
    this.profile = profile;
    this.chunkLen = chunkLength(this.tokens);
  }

  encode(data: FeedingTime[]): string {
    return data.map((entry) => this.encodeEntry(entry)).join('');
  }

  private transformValue(name: string, value: number): number {
    // Apply custom day encoding if transformer is configured
    return name === TemplateFieldName.DAYS && this.profile.encode
      ? this.profile.encode(value)
      : value;
  }

  private encodeEntry(entry: FeedingTime): string {
    return this.tokens
      .map((t) => {
        if (t.name === TemplateFieldName.FILL) {
          return '0'.repeat(t.length);
        }
        const rawValue = (entry as any)[t.name.toLowerCase()];
        if (rawValue === undefined || rawValue === null) {
          return ''.padStart(t.length, '0');
        }
        const value = this.transformValue(t.name, rawValue);
        return this.formatValue(t.name, value, t.length);
      })
      .join('');
  }

  private formatValue(name: string, value: number, length: number): string {
    // For BASE64 encoding type, use hex for all fields
    // For HEX encoding type, use hex only for DAYS field
    const useHex =
      !this.profile.encodingType ||
      this.profile.encodingType === EncodingType.BASE64
        ? true
        : HEX_FIELDS.has(name as TemplateFieldName);

    return useHex
      ? value.toString(16).padStart(length, '0')
      : value.toString(10).padStart(length, '0');
  }

  decode(data: string): FeedingTime[] {
    if (data.length % this.chunkLen !== 0)
      throw new Error('Invalid templated meal plan length');
    const out: FeedingTime[] = [];
    for (let i = 0; i < data.length; i += this.chunkLen) {
      const chunk = data.slice(i, i + this.chunkLen);
      out.push(this.decodeChunk(chunk));
    }
    return out;
  }

  private decodeChunk(chunk: string): FeedingTime {
    let pos = 0;
    const result: any = {};

    for (const t of this.tokens) {
      const part = chunk.slice(pos, pos + t.length);
      pos += t.length;

      if (t.name === TemplateFieldName.FILL) continue;

      const rawValue = this.parseValue(t.name, part);
      const value = this.untransformValue(t.name, rawValue);
      result[t.name.toLowerCase()] = value;
    }

    return result as FeedingTime;
  }

  private parseValue(name: string, part: string): number {
    // For BASE64 encoding type, use hex for all fields
    // For HEX encoding type, use hex only for DAYS field
    const useHex =
      !this.profile.encodingType ||
      this.profile.encodingType === EncodingType.BASE64
        ? true
        : HEX_FIELDS.has(name as TemplateFieldName);

    return useHex ? parseInt(part, 16) || 0 : parseInt(part, 10) || 0;
  }

  private untransformValue(name: string, value: number): number {
    // Apply custom day decoding if transformer is configured
    const shouldTransform =
      name === TemplateFieldName.DAYS && this.profile.decode;
    return shouldTransform ? this.profile.decode!(value) : value;
  }
}

export abstract class EncoderBase {
  protected profile: DeviceProfile;
  constructor(profile: DeviceProfile) {
    if (!profile || typeof (profile as any).encodingTemplate !== 'string') {
      throw new Error('Invalid device profile for encoding/decoding');
    }
    this.profile = profile;
  }
  abstract encode(data: FeedingTime[]): string;
  abstract decode(data: string): FeedingTime[];
}

class Base64Encoder extends EncoderBase {
  private hexToBase64(hex: string): string {
    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }
    return btoa(String.fromCharCode(...bytes));
  }

  private base64ToHex(base64: string): string {
    let binary: string;
    try {
      binary = atob(base64);
    } catch {
      throw new Error('Invalid base64');
    }

    const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  encode(data: FeedingTime[]): string {
    const template = (this.profile as any)?.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for Base64Encoder');
    }

    const encoder = new TemplateEncoder(template, this.profile);
    const hex = encoder.encode(data as any);
    return this.hexToBase64(hex);
  }

  decode(data: string): FeedingTime[] {
    if (!data || data === 'unknown') return [];

    const template = (this.profile as any)?.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for Base64Encoder');
    }

    const hex = this.base64ToHex(data);
    const encoder = new TemplateEncoder(template, this.profile);
    return encoder.decode(hex) as FeedingTime[];
  }
}

class TemplateBasedEncoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    const template = (this.profile as any)?.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for TemplateBasedEncoder');
    }
    const t = new TemplateEncoder(template, this.profile);
    return t.encode(data as any);
  }
  decode(data: string): FeedingTime[] {
    const template = (this.profile as any)?.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for TemplateBasedEncoder');
    }
    const t = new TemplateEncoder(template, this.profile);
    return t.decode(data) as FeedingTime[];
  }
}

class DictEncoder extends EncoderBase {
  constructor(profile: DeviceProfile) {
    super({ ...profile, encodingTemplate: profile.encodingTemplate || '' });
  }

  encode(data: FeedingTime[]): string {
    const encoded = data.map((entry) => {
      const result: any = {};
      
      Object.entries(entry).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        
        const outputKey = key === 'portion' ? 'size' : key;
        result[outputKey] = key === 'days' && this.profile.encode 
          ? this.profile.encode(value)
          : value;
      });
      
      return result;
    });
    
    return JSON.stringify(encoded);
  }

  decode(data: string): FeedingTime[] {
    if (!data || data === 'unknown') return [];
    
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map((entry: any) => {
        const result: any = {};
        
        Object.entries(entry).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          
          const outputKey = key === 'size' ? 'portion' : key;
          result[outputKey] = key === 'days' && this.profile.decode
            ? this.profile.decode(value as any)
            : value;
        });
        
        return result as FeedingTime;
      });
    } catch {
      throw new Error('Invalid JSON data for DICT encoding');
    }
  }
}

export enum EncodingType {
  BASE64 = 'base64',
  HEX = 'hex',
  DICT = 'dict',
}

const ENCODERS = {
  [EncodingType.BASE64]: Base64Encoder,
  [EncodingType.HEX]: TemplateBasedEncoder,
  [EncodingType.DICT]: DictEncoder,
};

export function getEncoder(profile: DeviceProfile) {
  if (!profile) {
    throw new Error('Device profile is required for encoder initialization');
  }
  const EncoderClass = ENCODERS[profile.encodingType ?? 'base64'];
  return new EncoderClass(profile);
}

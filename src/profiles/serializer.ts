import type { DeviceProfile, FeedingTime } from '../types';
import {
  TOKEN_REGEX,
  TemplateFieldName,
  HEX_FIELDS,
  EncodingType,
} from '../types';

export interface TemplateToken {
  name: string;
  length: number;
}

/**
 * Serializes/deserializes FeedingTime entries using a templated string format.
 *
 * Template format: "{FIELD:length}" where fields are concatenated into fixed-width strings.
 * Example: "{HOUR:2}{MINUTE:2}{PORTION:2}{DAYS:2}" → "08003007f" (8:00, 30g portion, all days)
 *
 * Supports:
 * - Custom field transformers via profile.encode/decode (e.g., day bit remapping)
 * - Hex or decimal encoding per field type
 * - Multiple entries concatenated into single string
 */
export class TemplateEncoder {
  private tokens: TemplateToken[];
  private profile: DeviceProfile;
  private chunkLen: number;

  constructor(template: string, profile: DeviceProfile) {
    if (!template) throw new Error('Template is required');
    this.tokens = TemplateEncoder.parseTemplate(template);
    this.profile = profile;
    this.chunkLen = TemplateEncoder.calculateChunkLength(this.tokens);
  }

  private static parseTemplate(template: string): TemplateToken[] {
    if (!template || typeof template !== 'string') {
      throw new Error('Invalid template');
    }

    const tokens: TemplateToken[] = [];
    TOKEN_REGEX.lastIndex = 0;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = TOKEN_REGEX.exec(template)) !== null) {
      if (match.index !== lastIndex) {
        throw new Error(
          'Invalid template: unexpected characters between tokens',
        );
      }

      const name = match[1];
      const lengthStr = match[2];
      if (!name || !lengthStr) {
        throw new Error('Invalid token format in template');
      }

      const len = parseInt(lengthStr, 10);
      if (!Number.isInteger(len) || len <= 0) {
        throw new Error('Invalid token length');
      }

      tokens.push({ name, length: len });
      lastIndex = TOKEN_REGEX.lastIndex;
    }

    if (lastIndex !== template.length) {
      throw new Error('Invalid template: tokens must exactly cover template');
    }

    return tokens;
  }

  private static calculateChunkLength(tokens: TemplateToken[]): number {
    return tokens.reduce((acc, t) => acc + t.length, 0);
  }

  encode(data: FeedingTime[]): string {
    return data.map((entry) => this.serializeEntry(entry)).join('');
  }

  decode(data: string): FeedingTime[] {
    if (data.length % this.chunkLen !== 0) {
      throw new Error('Invalid templated meal plan length');
    }
    const entries: FeedingTime[] = [];
    for (let i = 0; i < data.length; i += this.chunkLen) {
      const chunk = data.slice(i, i + this.chunkLen);
      entries.push(this.parseEntry(chunk));
    }
    return entries;
  }

  private serializeEntry(entry: FeedingTime): string {
    // Apply profile transformer first if configured
    const transformedEntry = this.profile.encode
      ? this.profile.encode(entry)
      : entry;

    return this.tokens
      .map((token) => {
        if (token.name === TemplateFieldName.FILL) {
          return '0'.repeat(token.length);
        }

        const fieldName = token.name.toLowerCase();
        const value = (transformedEntry as Record<string, unknown>)[fieldName];

        if (value === undefined || value === null) {
          return ''.padStart(token.length, '0');
        }

        return this.formatField(token.name, value as number, token.length);
      })
      .join('');
  }

  private parseEntry(chunk: string): FeedingTime {
    let position = 0;
    const entry: Record<string, unknown> = {};

    for (const token of this.tokens) {
      const segment = chunk.slice(position, position + token.length);
      position += token.length;

      if (token.name === TemplateFieldName.FILL) continue;

      const fieldName = token.name.toLowerCase();
      const parsedValue = this.parseField(token.name, segment);
      if (parsedValue !== null && parsedValue !== undefined) {
        entry[fieldName] = parsedValue;
      }
    }

    // Apply profile transformer after parsing if configured
    if (this.profile.decode) {
      const transformed = this.profile.decode(entry) as FeedingTime;
      return transformed;
    }

    return entry as FeedingTime;
  }

  private formatField(fieldName: string, value: number, width: number): string {
    const useHex = this.shouldUseHex(fieldName);
    return useHex
      ? value.toString(16).padStart(width, '0')
      : value.toString(10).padStart(width, '0');
  }

  private parseField(fieldName: string, segment: string): number {
    const useHex = this.shouldUseHex(fieldName);
    return useHex ? parseInt(segment, 16) || 0 : parseInt(segment, 10) || 0;
  }

  private shouldUseHex(fieldName: string): boolean {
    // BASE64 encoding type uses hex for all fields
    // HEX encoding type uses hex only for specific fields (e.g., DAYS)
    return (
      !this.profile.encodingType ||
      this.profile.encodingType === EncodingType.BASE64 ||
      HEX_FIELDS.has(fieldName as TemplateFieldName)
    );
  }
}

export abstract class EncoderBase {
  protected profile: DeviceProfile;
  constructor(profile: DeviceProfile) {
    if (!profile) {
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
    const template = this.profile.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for Base64Encoder');
    }

    const encoder = new TemplateEncoder(template, this.profile);
    const hex = encoder.encode(data);
    return this.hexToBase64(hex);
  }

  decode(data: string): FeedingTime[] {
    if (!data || data === 'unknown') return [];

    const template = this.profile.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for Base64Encoder');
    }

    const hex = this.base64ToHex(data);
    const encoder = new TemplateEncoder(template, this.profile);
    return encoder.decode(hex);
  }
}

class TemplateBasedEncoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    const template = this.profile.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for TemplateBasedEncoder');
    }
    const t = new TemplateEncoder(template, this.profile);
    return t.encode(data);
  }
  decode(data: string): FeedingTime[] {
    const template = this.profile.encodingTemplate;
    if (!template) {
      throw new Error('encodingTemplate is required for TemplateBasedEncoder');
    }
    const t = new TemplateEncoder(template, this.profile);
    return t.decode(data);
  }
}

class DictEncoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    // If profile has encode transformer, use it (handles everything: field mapping, day transform, wrapping)
    const output = this.profile.encode ? this.profile.encode(data) : data;
    return JSON.stringify(output);
  }

  decode(data: string): FeedingTime[] {
    if (!data || data === 'unknown') return [];

    try {
      const parsed = JSON.parse(data);

      // If profile has decode transformer, use it (handles everything: unwrapping, field mapping, day transform)
      const output = this.profile.decode ? this.profile.decode(parsed) : parsed;

      return Array.isArray(output) ? output : [];
    } catch {
      throw new Error('Invalid JSON data for DICT encoding');
    }
  }
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
  const EncoderClass = ENCODERS[profile.encodingType];
  return new EncoderClass(profile);
}

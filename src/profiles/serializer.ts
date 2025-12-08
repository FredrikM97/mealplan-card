import type { DeviceProfileGroup, FeedingTime } from '../types.js';
import { TOKEN_REGEX, TemplateFieldName, HEX_FIELDS } from '../types.js';

export interface TemplateToken {
  name: string;
  length: number;
}

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
    const length = parseTokenLength(match[2]);

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
  private profile?: DeviceProfileGroup;
  private chunkLen: number;

  constructor(template: string, profile?: DeviceProfileGroup) {
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
    return name === TemplateFieldName.DAYS && this.profile?.encode
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
      !this.profile?.encodingType ||
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
      !this.profile?.encodingType ||
      this.profile.encodingType === EncodingType.BASE64
        ? true
        : HEX_FIELDS.has(name as TemplateFieldName);

    return useHex ? parseInt(part, 16) || 0 : parseInt(part, 10) || 0;
  }

  private untransformValue(name: string, value: number): number {
    // Apply custom day decoding if transformer is configured
    return name === TemplateFieldName.DAYS && this.profile?.decode
      ? this.profile.decode(value)
      : value;
  }
}

export abstract class EncoderBase {
  protected profile: DeviceProfileGroup;
  constructor(profile: DeviceProfileGroup) {
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

export enum EncodingType {
  BASE64 = 'base64',
  HEX = 'hex',
}

const ENCODERS = {
  [EncodingType.BASE64]: Base64Encoder,
  [EncodingType.HEX]: TemplateBasedEncoder,
};

export function getEncoder(profile: DeviceProfileGroup) {
  if (!profile) {
    throw new Error('Device profile is required for encoder initialization');
  }
  const EncoderClass = ENCODERS[profile.encodingType ?? 'base64'];
  return new EncoderClass(profile);
}

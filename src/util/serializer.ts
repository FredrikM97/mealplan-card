import type { DeviceProfileGroup } from '../profiles/types';
export type TokenType = 'hex' | 'dec' | 'nib' | 'byte' | 'fill';

export interface TemplateToken {
  name: string;
  type: TokenType;
  length: number; // number of chars (hex/dec) or number of nibbles for 'nib'
}

const TOKEN_RE = /\{([A-Z_]+)\:([a-z]+)(\d+)\}/g;

const TYPE_ALIASES: Record<string, TokenType> = {
  h: 'hex',
  d: 'dec',
  n: 'nib',
  b: 'byte',
  f: 'fill',
};

export function parseTemplate(template: string): TemplateToken[] {
  if (!template || typeof template !== 'string')
    throw new Error('Invalid template');
  const tokens: TemplateToken[] = [];
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let lastIndex = 0;
  while ((match = TOKEN_RE.exec(template)) !== null) {
    if (match.index !== lastIndex)
      throw new Error('Invalid template: unexpected characters between tokens');
    const name = match[1];
    const rawType = match[2];
    const len = parseInt(match[3], 10);
    const mapped = TYPE_ALIASES[rawType];
    if (!mapped) throw new Error(`Unsupported token type: ${rawType}`);
    if (!Number.isInteger(len) || len <= 0)
      throw new Error('Invalid token length');
    tokens.push({ name, type: mapped, length: len });
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex !== template.length)
    throw new Error('Invalid template: tokens must exactly cover template');
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

  encode(entries: FeedingTime[]): string {
    return entries.map((entry) => this.encodeEntry(entry)).join('');
  }

  private encodeEntry(entry: FeedingTime): string {
    return this.tokens
      .map((t) => {
        const name = t.name;
        if (name === 'FILL') {
          return '0'.repeat(t.length);
        }
        const val = (entry as any)[name.toLowerCase()];
        if (typeof val === 'undefined' || val === null)
          return ''.padStart(t.length, '0');
        switch (t.type) {
          case 'hex':
            return Number(val).toString(16).padStart(t.length, '0');
          case 'dec':
            return Number(val).toString().padStart(t.length, '0');
          default:
            return ''.padStart(t.length, '0');
        }
      })
      .join('');
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
      if (t.name === 'FILL') continue;
      switch (t.type) {
        case 'hex':
          result[t.name.toLowerCase()] = parseInt(part, 16) || 0;
          break;
        case 'dec':
          result[t.name.toLowerCase()] = parseInt(part, 10) || 0;
          break;
        default:
          break;
      }
    }
    return result as FeedingTime;
  }
}

// end inlined template / mapping utilities

export interface FeedingTime {
  hour?: number;
  minute?: number;
  portion?: number;
  days?: number;
  enabled?: number;
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

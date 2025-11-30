import { DeviceProfileGroup, EncodingField } from '../profiles/types';
// --- Template DSL parser & TemplateEncoder inlined here (moved from separate files)
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

  private getDayBitMapping(): number[] {
    const p: any = this.profile as any;
    if (Array.isArray(p?.dayBitMapping) && p.dayBitMapping.length === 7)
      return p.dayBitMapping;
    if (p?.dayOrder === 'monday') return [1, 2, 3, 4, 5, 6, 0];
    return [0, 1, 2, 3, 4, 5, 6];
  }

  private rawToInternalDays(raw: number): number {
    const map = this.getDayBitMapping();
    let out = 0;
    for (let bit = 0; bit < 7; bit++) {
      if (raw & (1 << bit)) {
        out |= 1 << map[bit];
      }
    }
    return out;
  }

  private internalToRawDays(internal: number): number {
    const map = this.getDayBitMapping();
    const inv = new Array(7).fill(0);
    for (let rawBit = 0; rawBit < 7; rawBit++) inv[map[rawBit]] = rawBit;
    let out = 0;
    for (let d = 0; d < 7; d++) if (internal & (1 << d)) out |= 1 << inv[d];
    return out;
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
            if (name === 'DAYS') {
              const raw = this.internalToRawDays(Number(val));
              return raw.toString(16).padStart(t.length, '0');
            }
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
          if (t.name === 'DAYS') {
            const raw = parseInt(part, 16) || 0;
            result.days = this.rawToInternalDays(raw);
          } else {
            result[t.name.toLowerCase()] = parseInt(part, 16) || 0;
          }
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
    if (
      !profile ||
      !(
        Array.isArray(profile.encodingFields) ||
        typeof (profile as any).encodingTemplate === 'string'
      )
    )
      throw new Error('Invalid device profile for encoding/decoding');
    this.profile = profile;
  }
  abstract encode(data: FeedingTime[]): string;
  abstract decode(data: string): FeedingTime[];

  protected getDayBitMapping(): number[] {
    const p: any = this.profile as any;
    if (Array.isArray(p?.dayBitMapping) && p.dayBitMapping.length === 7)
      return p.dayBitMapping;
    if (p?.dayOrder === 'monday') return [1, 2, 3, 4, 5, 6, 0];
    return [0, 1, 2, 3, 4, 5, 6];
  }

  protected rawToInternalDays(raw: number): number {
    const map = this.getDayBitMapping();
    let out = 0;
    for (let bit = 0; bit < 7; bit++) {
      if (raw & (1 << bit)) out |= 1 << map[bit];
    }
    return out;
  }

  protected internalToRawDays(internal: number): number {
    const map = this.getDayBitMapping();
    const inv = new Array(7).fill(0);
    for (let rawBit = 0; rawBit < 7; rawBit++) inv[map[rawBit]] = rawBit;
    let out = 0;
    for (let d = 0; d < 7; d++) if (internal & (1 << d)) out |= 1 << inv[d];
    return out;
  }
}

class Base64Encoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    const template = (this.profile as any)?.encodingTemplate;
    if (template) {
      // Use TemplateEncoder -> produce hex string, then convert hex pairs to bytes
      const t = new TemplateEncoder(template, this.profile);
      const hex = t.encode(data as any);
      if (hex.length % 2 !== 0)
        throw new Error(
          'Template produced odd-length hex for base64 conversion',
        );
      const bytes: number[] = [];
      for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16));
      }
      return btoa(String.fromCharCode(...bytes));
    }
    const fields = this.profile.encodingFields;
    const rawData = this.convertToEncoded(data);
    const bytes: number[] = [];
    rawData.forEach((item, idx) => {
      for (const field of fields) {
        const prop = field;
        if (!(prop in item) || typeof (item as any)[prop] === 'undefined') {
          throw new Error(
            `Meal plan encode error: missing field '${prop}' in entry #${idx}. Possible layout mismatch or incomplete FeedingTime.`,
          );
        }
        // If this field is DAYS (bitmask), convert internal -> raw bit order before emitting
        if (prop === EncodingField.DAYS) {
          bytes.push(
            Number(this.internalToRawDays(Number((item as any)[prop]))),
          );
        } else {
          bytes.push(Number((item as any)[prop]));
        }
      }
    });
    return btoa(String.fromCharCode(...bytes));
  }
  decode(data: string): FeedingTime[] {
    if (!data || data === 'unknown') return [];
    const template = (this.profile as any)?.encodingTemplate;
    if (template) {
      // Decode base64 to bytes -> hex string -> feed to TemplateEncoder
      let binary: string;
      try {
        binary = atob(data);
      } catch {
        throw new Error('Invalid base64');
      }
      const bytes = new Uint8Array(
        [...binary].map((char) => char.charCodeAt(0)),
      );
      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const t = new TemplateEncoder(template, this.profile);
      return t.decode(hex) as FeedingTime[];
    }
    const fields = this.profile.encodingFields;
    const entrySize = fields.length;
    let binary: string;
    try {
      binary = atob(data);
    } catch {
      throw new Error('Invalid base64');
    }
    const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
    if (bytes.length % entrySize !== 0)
      throw new Error('Invalid meal plan length');
    const rawData = Array.from({ length: bytes.length / entrySize }, (_, i) => {
      const entry: any = {};
      for (let j = 0; j < fields.length; j++) {
        const prop = fields[j];
        entry[prop] = bytes[i * entrySize + j];
      }
      return entry;
    });
    return this.convertFromDecoded(rawData);
  }

  convertToEncoded(mealPlan: FeedingTime[]): any[] {
    if (
      this.profile.encodingFields.includes(EncodingField.MINUTE_HIGH) &&
      this.profile.encodingFields.includes(EncodingField.MINUTE_LOW)
    ) {
      return mealPlan.map((entry) => {
        const { hour, minute, ...rest } = entry;
        if (hour !== undefined && minute !== undefined) {
          const totalMinutes = hour * 60 + minute;
          const lowByte = totalMinutes & 0xff;
          const highByte = totalMinutes >> 8;
          return {
            ...rest,
            minute_high: highByte,
            minute_low: lowByte,
          };
        }
        return rest;
      });
    }
    return mealPlan;
  }

  convertFromDecoded(rawData: any[]): FeedingTime[] {
    return rawData.map((entry) => {
      const { minute_high, minute_low, ...sanitizedEntry } = entry;
      if (
        this.profile.encodingFields.includes(EncodingField.MINUTE_HIGH) &&
        this.profile.encodingFields.includes(EncodingField.MINUTE_LOW)
      ) {
        const totalMinutes = minute_low + (minute_high << 8);
        sanitizedEntry.hour = Math.floor(totalMinutes / 60);
        sanitizedEntry.minute = totalMinutes % 60;
      }
      // convert raw DAYS -> internal ordering
      if (sanitizedEntry.days !== undefined) {
        sanitizedEntry.days = this.rawToInternalDays(
          sanitizedEntry.days as number,
        );
      }
      return sanitizedEntry;
    });
  }
}

class TemplateBasedEncoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    const template =
      (this.profile as any)?.encodingTemplate ??
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}';
    const t = new TemplateEncoder(template, this.profile);
    return t.encode(data as any);
  }
  decode(data: string): FeedingTime[] {
    const template =
      (this.profile as any)?.encodingTemplate ??
      '{DAYS:h2}{HOUR:d2}{MINUTE:d2}{PORTION:d2}{ENABLED:d1}{FILL:h6}';
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
  // compact/alternate templates are handled via profile.encodingTemplate using TemplateBasedEncoder
};

export function getEncoder(profile: DeviceProfileGroup) {
  if (!profile) {
    throw new Error('Device profile is required for encoder initialization');
  }
  const EncoderClass = ENCODERS[profile.encodingType ?? 'base64'];
  return new EncoderClass(profile);
}

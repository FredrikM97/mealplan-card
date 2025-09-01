import { DeviceProfileGroup, EncodingField } from "../profiles/types";

export interface FeedingTime {
  hour?: number;
  minute?: number;
  portion?: number;
  days?: number;
  enabled?: 0 | 1;
}

export abstract class EncoderBase {
  protected profile: DeviceProfileGroup;
  constructor(profile: DeviceProfileGroup) {
    if (!profile || !Array.isArray(profile.encodingFields))
      throw new Error("Invalid device profile for encoding/decoding");
    this.profile = profile;
  }
  abstract encode(data: FeedingTime[]): string;
  abstract decode(data: string): FeedingTime[];
}

class Base64Encoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    const fields = this.profile.encodingFields;
    const rawData = this.convertToEncoded(data);
    const bytes: number[] = [];
    rawData.forEach((item, idx) => {
      for (const field of fields) {
        const prop = field;
        if (!(prop in item) || typeof (item as any)[prop] === "undefined") {
          throw new Error(
            `Meal plan encode error: missing field '${prop}' in entry #${idx}. Possible layout mismatch or incomplete FeedingTime.`,
          );
        }
        bytes.push(Number((item as any)[prop]));
      }
    });
    return btoa(String.fromCharCode(...bytes));
  }
  decode(data: string): FeedingTime[] {
    if (!data || data === "unknown") return [];
    const fields = this.profile.encodingFields;
    const entrySize = fields.length;
    let binary: string;
    try {
      binary = atob(data);
    } catch {
      throw new Error("Invalid base64");
    }
    const bytes = new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
    if (bytes.length % entrySize !== 0)
      throw new Error("Invalid meal plan length");
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
      return sanitizedEntry;
    });
  }
}

class HexEncoder extends EncoderBase {
  encode(data: FeedingTime[]): string {
    return data
      .map((entry) => {
        const days = (entry.days ?? 0).toString(16).padStart(2, "0");
        const hour = (entry.hour ?? 0).toString().padStart(2, "0");
        const minute = (entry.minute ?? 0).toString().padStart(2, "0");
        const portion = (entry.portion ?? 0).toString().padStart(2, "0");
        const enabled = (entry.enabled ?? 0).toString();
        const filler = "000000";
        return `${days}${hour}${minute}${portion}${enabled}${filler}`;
      })
      .join("");
  }
  decode(data: string): FeedingTime[] {
    const schedules: FeedingTime[] = [];
    if (data.length % 15 !== 0) throw new Error("Invalid meal plan length");
    for (let i = 0; i < data.length; i += 15) {
      const chunk = data.slice(i, i + 15);
      if (chunk.length < 15) break;
      const days = parseInt(chunk.slice(0, 2), 16);
      const hour = parseInt(chunk.slice(2, 4), 10);
      const minute = parseInt(chunk.slice(4, 6), 10);
      const portion = parseInt(chunk.slice(6, 8), 10);
      const enabled = parseInt(chunk.slice(8, 9), 10) as 0 | 1;

      schedules.push({ days, hour, minute, portion, enabled });
    }
    return schedules;
  }
}

export enum EncodingType {
  BASE64 = "base64",
  HEX = "hex",
}

const ENCODERS = {
  [EncodingType.BASE64]: Base64Encoder,
  [EncodingType.HEX]: HexEncoder,
};

export function getEncoder(profile: DeviceProfileGroup) {
  if (!profile) {
    throw new Error("Device profile is required for encoder initialization");
  }
  const EncoderClass = ENCODERS[profile.encodingType ?? "base64"];
  return new EncoderClass(profile);
}

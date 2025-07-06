// Layout definitions for meal plan encoding/decoding
export type LayoutField = string;

export interface LayoutDef {
  name: string;
  entrySize: number;
  fields: LayoutField[];
}

export const mealplanLayouts: LayoutDef[] = [
  {
    name: 'tuya_with_daysMask',
    entrySize: 5,
    fields: [
      'daysMask',
      'hour',
      'minute',
      'portion',
      'enabled',
    ],
  },
  {
    name: 'tuya_no_daysMask',
    entrySize: 4,
    fields: [
      'hour',
      'minute',
      'portion',
      'enabled',
    ],
  },
];

export function getLayoutByName(name: string): LayoutDef | undefined {
  return mealplanLayouts.find(l => l.name === name);
}

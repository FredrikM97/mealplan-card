import type { FeedingTime } from '../../src/types';

export const testMeals = {
  breakfast: {
    hour: 8,
    minute: 0,
    portion: 10,
    days: 127,
    enabled: 1,
  } as FeedingTime,
  lunch: {
    hour: 12,
    minute: 0,
    portion: 15,
    days: 127,
    enabled: 1,
  } as FeedingTime,
  dinner: {
    hour: 18,
    minute: 0,
    portion: 20,
    days: 127,
    enabled: 1,
  } as FeedingTime,
};

// Internal day bit convention: bit 0 = Monday ... bit 6 = Sunday.
export const daySpecificMeals = {
  sundayOnly: {
    hour: 9,
    minute: 0,
    portion: 1,
    enabled: 1,
    days: 0b1000000,
  } as FeedingTime,
  weekdaysOnly: {
    hour: 8,
    minute: 0,
    portion: 2,
    enabled: 1,
    days: 0b0011111,
  } as FeedingTime,
  weekendsOnly: {
    hour: 10,
    minute: 0,
    portion: 1,
    enabled: 1,
    days: 0b1100000,
  } as FeedingTime,
  allDays: {
    hour: 8,
    minute: 0,
    portion: 2,
    enabled: 1,
    days: 0b1111111,
  } as FeedingTime,
  noDayMask: { hour: 8, minute: 0, portion: 2, enabled: 1 } as FeedingTime,
};

export const testProfiles = {
  noModels: () => [
    {
      manufacturer: 'TestMfg',
      models: [],
      encodingTemplate: '{TIME:2}',
      fields: [],
    },
  ],

  singleModel: () => [
    {
      manufacturer: 'TestMfg',
      models: ['OnlyModel'],
      encodingTemplate: '{TIME:2}',
      fields: [],
    },
  ],

  multipleModels: () => [
    {
      manufacturer: 'TestMfg',
      models: ['Model1', 'Model2'],
      encodingTemplate: '{TIME:2}',
      fields: [],
    },
  ],
};

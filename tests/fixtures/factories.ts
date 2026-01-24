import { vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import type { ReactiveControllerHost } from 'lit';
import { profiles } from '../../src/profiles/profiles';
import { MealStateController } from '../../src/mealStateController';
import type {
  FeedingTime,
  DeviceProfile,
  MealPlanCardConfig,
  HomeAssistant,
} from '../../src/types';
import { ProfileField, TransportType, EncodingType } from '../../src/types';
import { ScheduleView } from '../../src/components/schedule-view';
import { getEncoder } from '../../src/profiles/serializer';
import { testMeals } from './data';
import { MealPlanCard } from '../../src/main';

export function createMockHass(options?: {
  sensor?: { id: string; state: string; attributes?: Record<string, unknown> };
  overrides?: Record<string, unknown>;
}): HomeAssistant {
  const base: HomeAssistant = {
    states: {},
    callService: vi
      .fn()
      .mockResolvedValue(undefined) as unknown as HomeAssistant['callService'],
    language: 'en',
  };

  if (options?.sensor) {
    base.states = {
      [options.sensor.id]: {
        state: options.sensor.state,
        attributes: options.sensor.attributes ?? {},
      },
    };
  }

  return { ...base, ...options?.overrides } as HomeAssistant;
}

export function createMockHassWithSensor(
  sensorId: string,
  base64Data: string,
  attributes: Record<string, unknown> = {},
): HomeAssistant {
  return createMockHass({
    sensor: { id: sensorId, state: base64Data, attributes },
  });
}

export function createMockHost(): ReactiveControllerHost & EventTarget {
  const eventTarget = new EventTarget();
  return Object.assign(eventTarget, {
    addController: vi.fn(),
    removeController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
  });
}

export function createEditorMockHass() {
  return {
    localize: (key: string) => key,
    entities: {
      'sensor.test': {
        device_id: 'device1',
      },
    },
    devices: {
      device1: {
        model: 'Cleverio PF-100',
      },
    },
  };
}

export function createMockProfile(
  overrides?: Partial<DeviceProfile>,
): DeviceProfile {
  return {
    manufacturer: overrides?.manufacturer ?? 'Test',
    models: overrides?.models ?? [],
    encodingType: overrides?.encodingType ?? EncodingType.BASE64,
    encodingTemplate:
      overrides?.encodingTemplate ??
      '{DAYS:8}{HOUR:5}{MINUTE:6}{PORTION:4}{ENABLED:1}',
    fields: overrides?.fields ?? [ProfileField.DAYS, ProfileField.PORTION],
  };
}

export function createMealStateController(options?: {
  sensor?: string;
  profile?: DeviceProfile;
  hass?: HomeAssistant;
  host?: ReactiveControllerHost;
  helper?: string;
  config?: Partial<MealPlanCardConfig>;
}): MealStateController {
  const host = options?.host ?? createMockHost();
  const config: MealPlanCardConfig = {
    sensor: options?.sensor ?? 'sensor.test',
    helper: options?.helper,
    manufacturer: 'Test',
    title: 'Test Card',
    portions: 6,
    transport_type: TransportType.SENSOR,
    ...(options?.config as Partial<MealPlanCardConfig>),
  } as MealPlanCardConfig;

  console.log('Creating MealStateController with config:', config);
  const controller = new MealStateController(
    host,
    options?.profile ?? profiles[0],
    () => options?.hass ?? createMockHass(),
    config,
  );

  return controller;
}

export function encodeMealData(meals: FeedingTime | FeedingTime[]): string {
  const profile = getTestProfile(); // Get your test profile
  const encoder = getEncoder(profile);

  const mealList = Array.isArray(meals) ? meals : [meals];
  return encoder.encode(mealList);
}

export async function createScheduleViewWithMeals(
  meals: FeedingTime[] = [],
  sensorId: string = 'sensor.test',
): Promise<ScheduleView> {
  const base64Data =
    meals.length > 0
      ? encodeMealData(meals)
      : encodeMealData(testMeals.breakfast);

  const hass = createMockHassWithSensor(sensorId, base64Data);
  const controller = createMealStateController({ hass });

  return createScheduleViewFixture(controller, {
    hass,
  }) as Promise<ScheduleView>;
}

export function createMockHassWithCallService() {
  return {
    ...createMockHass(),
    callService: vi.fn(),
  };
}

export function getTestProfile(): DeviceProfile {
  return profiles[0];
}

export function getCleverioProfile(): DeviceProfile {
  const profileGroup = profiles.find((p) => p.manufacturer === 'Cleverio');
  if (!profileGroup) {
    throw new Error('Cleverio profile not found');
  }
  return profileGroup;
}

export function createMealPlanCardConfig(
  overrides?: Partial<{
    sensor: string;
    title: string;
    manufacturer: string;
    model: string;
    helper: string;
    portions: number;
    minimal: boolean;
  }>,
): MealPlanCardConfig {
  if (overrides?.minimal) {
    return {
      sensor: overrides?.sensor ?? '',
      title: overrides?.title ?? '',
      helper: overrides?.helper ?? '',
      transport_type: TransportType.SENSOR,
    };
  }

  const profile = getCleverioProfile();
  return {
    sensor: overrides?.sensor ?? 'sensor.test',
    title: overrides?.title ?? 'Test',
    manufacturer: overrides?.manufacturer ?? profile.manufacturer,
    model: overrides?.model ?? '',
    helper: overrides?.helper ?? '',
    transport_type: TransportType.SENSOR,
    ...(overrides?.portions !== undefined && { portions: overrides.portions }),
  };
}

export const createMinimalEditorConfig = (
  overrides?: Partial<{ sensor: string; title: string; helper: string }>,
): MealPlanCardConfig =>
  createMealPlanCardConfig({ ...overrides, minimal: true });

export const createCardEditorFixture = (): Promise<HTMLElement> =>
  fixture<HTMLElement>(html`<mealplan-card-editor></mealplan-card-editor>`);

export const createMealPlanCardFixture = (
  config: MealPlanCardConfig,
  hass: HomeAssistant,
): Promise<MealPlanCard> => {
  return fixture<MealPlanCard>(
    html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
  );
};

export const createMealCardFixture = (
  meal: FeedingTime & { _idx?: number },
  options?: { profile?: DeviceProfile; expanded?: boolean },
): Promise<HTMLElement> => {
  const profile = options?.profile ?? getTestProfile();
  const mealWithIdx = meal._idx !== undefined ? meal : { ...meal, _idx: 0 };
  return fixture(html`
    <meal-card
      .meal=${mealWithIdx}
      .profile=${profile}
      .expanded=${options?.expanded ?? false}
    ></meal-card>
  `);
};

export const createScheduleViewFixture = async (
  controller: MealStateController,
  options?: {
    hass?: HomeAssistant;
    profile?: DeviceProfile;
    meals?: FeedingTime[];
  },
): Promise<ScheduleView> => {
  const el = await fixture<ScheduleView>(html`
    <schedule-view
      .mealState=${controller}
      .hass=${options?.hass ?? {}}
      .profile=${options?.profile}
    ></schedule-view>
  `);
  return el;
};

export const createEditDialogFixture = (
  options: { open?: boolean; profile?: DeviceProfile; meal?: FeedingTime } = {},
): Promise<HTMLElement> =>
  fixture(html`
    <meal-edit-dialog
      .open=${options.open ?? true}
      .profile=${options.profile}
      .meal=${options.meal}
    ></meal-edit-dialog>
  `);

export const createOverviewFixture = (
  mealState: MealStateController,
  portions = 1,
): Promise<HTMLElement> =>
  fixture(
    html`<meal-overview
      .mealState=${mealState}
      .portions=${portions}
    ></meal-overview>`,
  );

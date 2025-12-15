import { vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import type { ReactiveControllerHost } from 'lit';
import { profiles } from '../../src/profiles/profiles';
import { MealStateController } from '../../src/mealStateController';
import type { FeedingTime, DeviceProfile } from '../../src/types';
import { ProfileField } from '../../src/types';

export function createMockHass(options?: {
  sensor?: { id: string; state: string; attributes?: Record<string, any> };
  overrides?: any;
}) {
  const base = {
    states: {},
    callService: vi.fn().mockResolvedValue(undefined),
  };

  if (options?.sensor) {
    base.states = {
      [options.sensor.id]: {
        state: options.sensor.state,
        attributes: options.sensor.attributes ?? {},
      },
    };
  }

  return { ...base, ...options?.overrides };
}

export function createMockHassWithSensor(
  sensorId: string,
  base64Data: string,
  attributes: Record<string, any> = {},
) {
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
    encodingTemplate:
      overrides?.encodingTemplate ??
      '{DAYS:8}{HOUR:5}{MINUTE:6}{PORTION:4}{ENABLED:1}',
    firstDay: overrides?.firstDay ?? 0,
    fields: overrides?.fields ?? [ProfileField.DAYS, ProfileField.PORTION],
  };
}

export function createMealStateController(
  meals: FeedingTime[] = [],
  options?: {
    sensor?: string;
    profile?: DeviceProfile;
    hass?: any;
    helper?: string;
  },
) {
  const host = createMockHost();
  const controller = new MealStateController(
    host,
    options?.sensor ?? 'sensor.test',
    options?.profile ?? profiles[0],
    options?.hass ?? createMockHass(),
    options?.helper,
  );

  if (meals.length > 0) {
    controller.setMeals(meals);
  }

  return controller;
}

export function getTestProfile() {
  return profiles[0];
}

export function getCleverioProfile() {
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
) {
  if (overrides?.minimal) {
    return {
      sensor: overrides?.sensor ?? '',
      title: overrides?.title ?? '',
      helper: overrides?.helper ?? '',
    };
  }

  const profile = getCleverioProfile();
  return {
    sensor: overrides?.sensor ?? 'sensor.test',
    title: overrides?.title ?? 'Test',
    manufacturer: overrides?.manufacturer ?? profile.manufacturer,
    model: overrides?.model ?? '',
    helper: overrides?.helper ?? '',
    ...(overrides?.portions !== undefined && { portions: overrides.portions }),
  };
}

export const createMinimalEditorConfig = (
  overrides?: Partial<{ sensor: string; title: string; helper: string }>,
) => createMealPlanCardConfig({ ...overrides, minimal: true });

export const createCardEditorFixture = () =>
  fixture<any>(html`<mealplan-card-editor></mealplan-card-editor>`);

export const createMealPlanCardFixture = (config: any, hass: any) =>
  fixture<any>(
    html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
  );

export const createMealCardFixture = (
  meal: FeedingTime & { _idx?: number },
  options?: { profile?: DeviceProfile; expanded?: boolean },
) => {
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

export const createScheduleViewFixture = (
  mealState: MealStateController,
  options?: { hass?: any; profile?: DeviceProfile; meals?: FeedingTime[] },
) =>
  fixture(html`
    <schedule-view
      .mealState=${mealState}
      .hass=${options?.hass ?? {}}
      .profile=${options?.profile}
      .meals=${options?.meals}
    ></schedule-view>
  `);

export const createEditDialogFixture = (
  options: { open?: boolean; profile?: DeviceProfile; meal?: FeedingTime } = {},
) =>
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
) =>
  fixture(
    html`<meal-overview
      .mealState=${mealState}
      .portions=${portions}
    ></meal-overview>`,
  );

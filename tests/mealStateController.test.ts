import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MealStateController } from '../src/mealStateController';
import { profiles } from '../src/profiles/profiles';
import { EVENT_MEAL_MESSAGE, MESSAGE_TYPE_INFO } from '../src/constants';
import type { ReactiveControllerHost } from 'lit';

describe('MealStateController', () => {
  let mockHost: ReactiveControllerHost & EventTarget;
  let controller: MealStateController;
  let errorListener: ReturnType<typeof vi.fn>;
  const profile = profiles[0];

  beforeEach(() => {
    const eventTarget = new EventTarget();
    errorListener = vi.fn();
    eventTarget.addEventListener(
      EVENT_MEAL_MESSAGE,
      errorListener as EventListener,
    );

    mockHost = Object.assign(eventTarget, {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
      updateComplete: Promise.resolve(true),
    });
  });

  it('initializes with empty meals', () => {
    const mockHass = {
      states: {},
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      mockHass,
      'input_text.helper',
    );
    expect(controller.meals).toEqual([]);
  });

  it('sets and gets meals', () => {
    const mockHass = {
      states: {},
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      mockHass,
    );
    const meals = [
      { hour: 8, minute: 0, portion: 1, days: 127, enabled: 1 },
      { hour: 18, minute: 30, portion: 2, days: 127, enabled: 1 },
    ];
    controller.setMeals(meals);
    expect(controller.meals).toEqual(meals);
  });

  it('resets to saved state', async () => {
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': {
          state: base64,
        },
      },
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      hass,
    );

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 10));

    const original = [...controller.meals];
    controller.setMeals([]);
    expect(controller.meals).toEqual([]);

    await controller.updateFromHass();
    expect(controller.meals.length).toBeGreaterThan(0);
  });

  it('decodes meals from hass sensor state', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      undefined,
    );
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': { state: base64 },
      },
      callService: vi.fn(),
    };

    controller.hass = hass;
    await controller.updateFromHass();

    const meals = controller.meals;
    expect(meals.length).toBeGreaterThan(0);
    expect(meals[0].hour).toBe(8);
    expect(meals[0].minute).toBe(0);
    expect(meals[0].portion).toBe(10);
    expect(errorListener).not.toHaveBeenCalled();
  });

  it('handles invalid sensor state', async () => {
    const hass = {
      states: {
        'sensor.test': { state: 'invalid_base64' },
      },
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      hass,
    );

    await controller.updateFromHass();

    expect(controller.meals).toEqual([]);
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          message: 'Failed to decode meal plan data.',
          type: MESSAGE_TYPE_INFO,
        },
      }),
    );
  });

  it('handles unavailable sensor state', async () => {
    const hass = {
      states: {
        'sensor.test': { state: 'unavailable' },
      },
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      hass,
    );

    await controller.updateFromHass();

    expect(controller.meals).toEqual([]);
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          message: expect.stringContaining('No valid meal plan data'),
          type: MESSAGE_TYPE_INFO,
        },
      }),
    );
  });

  it('syncs helper when out of sync', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      undefined,
      'input_text.helper',
    );
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': { state: base64 },
        'input_text.helper': { state: 'old_value' },
      },
      callService: vi.fn(),
    };

    controller.hass = hass;
    await controller.updateFromHass();

    expect(hass.callService).toHaveBeenCalledWith('input_text', 'set_value', {
      entity_id: 'input_text.helper',
      value: base64,
    });
  });

  it('saves meals to sensor', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      undefined,
    );
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const hass = {
      states: {},
      callService: vi.fn(),
    };

    controller.hass = hass;
    controller.setMeals(meals);
    await controller.saveMeals(controller.meals);

    expect(hass.callService).toHaveBeenCalledWith(
      'sensor',
      'set_value',
      expect.objectContaining({
        entity_id: 'sensor.test',
        value: expect.any(String),
      }),
    );
  });

  it('throws error when saving without hass', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      undefined,
    );
    controller.setMeals([
      { hour: 8, minute: 0, portion: 1, days: 127, enabled: 1 },
    ]);

    await expect(controller.saveMeals(controller.meals)).rejects.toThrow(
      'Cannot save: hass not initialized',
    );
  });

  it('falls back to helper when sensor is invalid', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      undefined,
      'input_text.helper',
    );
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': { state: 'unknown' },
        'input_text.helper': { state: base64 },
      },
      callService: vi.fn(),
    };

    controller.hass = hass;
    await controller.updateFromHass();

    const meals = controller.meals;
    expect(meals.length).toBeGreaterThan(0);
    expect(errorListener).not.toHaveBeenCalled();
  });

  it('handles invalid helper fallback', async () => {
    const hass = {
      states: {
        'sensor.test': { state: 'unknown' },
        'input_text.helper': { state: 'invalid_data' },
      },
      callService: vi.fn(),
    };
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      hass,
      'input_text.helper',
    );

    await controller.updateFromHass();

    expect(controller.meals).toEqual([]);
    expect(errorListener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          message: 'Failed to decode meal plan data.',
          type: MESSAGE_TYPE_INFO,
        },
      }),
    );
  });
});

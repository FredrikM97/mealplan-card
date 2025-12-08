import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MealStateController } from '../src/mealStateController';
import { profiles } from '../src/profiles/profiles';
import type { ReactiveControllerHost } from 'lit';

describe('MealStateController', () => {
  let mockHost: ReactiveControllerHost;
  let controller: MealStateController;
  const profile = profiles[0];

  beforeEach(() => {
    mockHost = {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
      updateComplete: Promise.resolve(true),
    };
  });

  it('initializes with empty meals', () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      'input_text.helper',
    );
    expect(controller.getMeals()).toEqual([]);
    expect(controller.getPersistedMeals()).toEqual([]);
    expect(controller.getDecodeError()).toBeNull();
  });

  it('sets and gets meals', () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const meals = [
      { hour: 8, minute: 0, portion: 1, days: 127, enabled: 1 },
      { hour: 18, minute: 30, portion: 2, days: 127, enabled: 1 },
    ];
    controller.setMeals(meals);
    expect(controller.getMeals()).toEqual(meals);
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });

  it('detects pending changes', () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    expect(controller.hasPendingChanges()).toBe(false);

    controller.setMeals([
      { hour: 8, minute: 0, portion: 1, days: 127, enabled: 1 },
    ]);
    expect(controller.hasPendingChanges()).toBe(true);
  });

  it('resets to saved state', () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const hass = {
      states: {
        'sensor.test': {
          state: btoa(String.fromCharCode(127, 8, 0, 10, 1)),
        },
      },
      callService: vi.fn(),
    };
    controller.setHass(hass);
    controller.updateFromHass();

    const original = controller.getMeals();
    controller.setMeals([]);
    expect(controller.getMeals()).toEqual([]);

    controller.resetToSaved();
    expect(controller.getMeals()).toEqual(original);
  });

  it('decodes meals from hass sensor state', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': { state: base64 },
      },
      callService: vi.fn(),
    };

    controller.setHass(hass);
    await controller.updateFromHass();

    const meals = controller.getMeals();
    expect(meals.length).toBeGreaterThan(0);
    expect(meals[0].hour).toBe(8);
    expect(meals[0].minute).toBe(0);
    expect(meals[0].portion).toBe(10);
    expect(controller.getDecodeError()).toBeNull();
  });

  it('handles invalid sensor state', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const hass = {
      states: {
        'sensor.test': { state: 'invalid_base64' },
      },
      callService: vi.fn(),
    };

    controller.setHass(hass);
    await controller.updateFromHass();

    expect(controller.getMeals()).toEqual([]);
    expect(controller.getDecodeError()).not.toBeNull();
  });

  it('handles unavailable sensor state', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const hass = {
      states: {
        'sensor.test': { state: 'unavailable' },
      },
      callService: vi.fn(),
    };

    controller.setHass(hass);
    await controller.updateFromHass();

    expect(controller.getMeals()).toEqual([]);
    expect(controller.getDecodeError()).not.toBeNull();
  });

  it('syncs helper when out of sync', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
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

    controller.setHass(hass);
    await controller.updateFromHass();

    expect(hass.callService).toHaveBeenCalledWith('input_text', 'set_value', {
      entity_id: 'input_text.helper',
      value: base64,
    });
  });

  it('saves meals to sensor', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const hass = {
      states: {},
      callService: vi.fn(),
    };

    controller.setHass(hass);
    controller.setMeals(meals);
    await controller.saveMeals();

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
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    controller.setMeals([
      { hour: 8, minute: 0, portion: 1, days: 127, enabled: 1 },
    ]);

    await expect(controller.saveMeals()).rejects.toThrow(
      'Cannot save: hass not initialized',
    );
  });

  it('falls back to helper when sensor is invalid', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
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

    controller.setHass(hass);
    await controller.updateFromHass();

    const meals = controller.getMeals();
    expect(meals.length).toBeGreaterThan(0);
    expect(controller.getDecodeError()).toBeNull();
  });

  it('handles invalid helper fallback', async () => {
    controller = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      'input_text.helper',
    );
    const hass = {
      states: {
        'sensor.test': { state: 'unknown' },
        'input_text.helper': { state: 'invalid_data' },
      },
      callService: vi.fn(),
    };

    controller.setHass(hass);
    await controller.updateFromHass();

    expect(controller.getMeals()).toEqual([]);
    expect(controller.getDecodeError()).not.toBeNull();
  });

  it('warns when updating without hass', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await controller.updateFromHass();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Cannot update from hass: hass not initialized',
    );
    consoleSpy.mockRestore();
  });

  it('updates persisted meals but not current when allowUpdate is false', async () => {
    controller = new MealStateController(mockHost, 'sensor.test', profile);
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const hass = {
      states: {
        'sensor.test': { state: base64 },
      },
      callService: vi.fn(),
    };

    controller.setHass(hass);
    controller.setMeals([
      { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
    ]);

    await controller.updateFromHass(false);

    // Persisted should be updated
    expect(controller.getPersistedMeals()[0].hour).toBe(8);
    // Current meals should still be what we set
    expect(controller.getMeals()[0].hour).toBe(12);
  });
});

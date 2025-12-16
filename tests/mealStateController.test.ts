import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MealStateController } from '../src/mealStateController';
import type { ReactiveControllerHost } from 'lit';
import { testMeals, encodeMealData } from './fixtures/data';
import { profiles } from '../src/profiles/profiles';
import { TransportType } from '../src/types';
import {
  createMockHass,
  createMockHost,
  getTestProfile,
  createMockHassWithSensor,
} from './fixtures/factories';

describe('MealStateController', () => {
  let mockHost: ReactiveControllerHost & EventTarget;
  let controller: MealStateController;
  const profile = getTestProfile();

  beforeEach(() => {
    mockHost = createMockHost();
  });

  it('initializes with empty meals', () => {
    controller = new MealStateController(mockHost, profile, createMockHass(), {
      sensor: 'sensor.test',
      helper: 'input_text.helper',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    expect(controller.meals).toEqual([]);
  });

  it('sets and gets meals', () => {
    controller = new MealStateController(mockHost, profile, createMockHass(), {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    const meals = [testMeals.breakfast, testMeals.lunch];
    controller.meals = meals;
    expect(controller.meals).toEqual(meals);
  });

  it('resets to saved state', async () => {
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const hass = {
      ...createMockHassWithSensor('sensor.test', base64),
      callService: vi.fn(),
    };
    controller = new MealStateController(mockHost, profile, hass, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 10));

    const original = [...controller.meals];
    controller.meals = [];
    expect(controller.meals).toEqual([]);

    await controller.updateFromHass();
    expect(controller.meals.length).toBeGreaterThan(0);
  });

  it('decodes meals from hass sensor state', async () => {
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const hass = {
      ...createMockHassWithSensor('sensor.test', base64),
      callService: vi.fn(),
    };

    controller.hass = hass;
    await controller.updateFromHass();

    const meals = controller.meals;
    expect(meals.length).toBeGreaterThan(0);
    expect(meals[0].hour).toBe(8);
    expect(meals[0].minute).toBe(0);
    expect(meals[0].portion).toBe(10);
  });

  it('handles invalid sensor state', async () => {
    const hass = {
      ...createMockHassWithSensor('sensor.test', 'invalid_base64'),
      callService: vi.fn(),
    };
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    controller.hass = hass;

    // Should throw on decode error
    await expect(controller.updateFromHass()).rejects.toThrow('Invalid base64');
  });

  it('handles unavailable sensor state', async () => {
    const hass = {
      ...createMockHassWithSensor('sensor.test', 'unavailable'),
      callService: vi.fn(),
    };
    controller = new MealStateController(mockHost, profile, hass, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });

    await controller.updateFromHass();

    expect(controller.meals).toEqual([]);
  });

  it('syncs helper when saving meals', async () => {
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      helper: 'input_text.helper',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    const meals = [testMeals.breakfast];
    const hass = {
      states: {},
      callService: vi.fn(),
    };

    controller.hass = hass;
    await controller.saveMeals(meals);

    // Should call set_value for both sensor and helper
    expect(hass.callService).toHaveBeenCalledWith('sensor', 'set_value', {
      entity_id: 'sensor.test',
      value: expect.any(String),
    });
    expect(hass.callService).toHaveBeenCalledWith('input_text', 'set_value', {
      entity_id: 'input_text.helper',
      value: expect.any(String),
    });
  });

  it('saves meals to sensor', async () => {
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    const meals = [testMeals.breakfast];
    const hass = {
      states: {},
      callService: vi.fn(),
    };

    controller.hass = hass;
    controller.meals = meals;
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
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    controller.meals = [testMeals.breakfast];

    // Will throw because hass is undefined
    await expect(controller.saveMeals(controller.meals)).rejects.toThrow();
  });

  it('fallback to helper when sensor is unknown', async () => {
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      helper: 'input_text.helper',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    const base64 = encodeMealData(127, 8, 0, 10, 1);
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
  });

  it('handles invalid helper fallback', async () => {
    const hass = {
      states: {
        'sensor.test': { state: 'unknown' },
        'input_text.helper': { state: 'invalid_data' },
      },
      callService: vi.fn(),
    };
    controller = new MealStateController(mockHost, profile, undefined, {
      sensor: 'sensor.test',
      helper: 'input_text.helper',
      manufacturer: 'Test',
      title: 'Test',
      portions: 6,
      transport_type: TransportType.SENSOR,
    });
    controller.hass = hass;

    // Should throw on decode error from helper
    await expect(controller.updateFromHass()).rejects.toThrow('Invalid base64');
  });

  describe('Subscription system', () => {
    it('notifies subscribers when meals change', () => {
      controller = new MealStateController(
        mockHost,
        profile,
        createMockHass(),
        {
          sensor: 'sensor.test',
          manufacturer: 'Test',
          title: 'Test',
          portions: 6,
          transport_type: TransportType.SENSOR,
        },
      );

      const callback = vi.fn();
      const unsubscribe = controller.subscribe(callback);

      controller.meals = [testMeals.breakfast];

      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
    });

    it('stops notifying after unsubscribe', () => {
      controller = new MealStateController(
        mockHost,
        profile,
        createMockHass(),
        {
          sensor: 'sensor.test',
          manufacturer: 'Test',
          title: 'Test',
          portions: 6,
          transport_type: TransportType.SENSOR,
        },
      );

      const callback = vi.fn();
      const unsubscribe = controller.subscribe(callback);

      controller.meals = [testMeals.breakfast];
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      controller.meals = [testMeals.lunch];
      expect(callback).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('supports multiple subscribers', () => {
      controller = new MealStateController(
        mockHost,
        profile,
        createMockHass(),
        {
          sensor: 'sensor.test',
          manufacturer: 'Test',
          title: 'Test',
          portions: 6,
          transport_type: TransportType.SENSOR,
        },
      );

      const callback1 = vi.fn();
      const callback2 = vi.fn();
      controller.subscribe(callback1);
      controller.subscribe(callback2);

      controller.meals = [testMeals.breakfast];

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('triggers host requestUpdate when meals change', () => {
      controller = new MealStateController(
        mockHost,
        profile,
        createMockHass(),
        {
          sensor: 'sensor.test',
          manufacturer: 'Test',
          title: 'Test',
          portions: 6,
          transport_type: TransportType.SENSOR,
        },
      );

      const requestUpdate = vi.spyOn(mockHost, 'requestUpdate');

      controller.meals = [testMeals.breakfast];

      expect(requestUpdate).toHaveBeenCalled();
    });
  });

  describe('MQTT transport', () => {
    it('publishes to MQTT when transport_type is mqtt', async () => {
      const hass = {
        states: {},
        callService: vi.fn(),
      };

      controller = new MealStateController(mockHost, profile, hass, {
        sensor: 'sensor.feeder_kitchen',
        manufacturer: 'Test',
        title: 'Test',
        portions: 6,
        transport_type: TransportType.MQTT,
      });

      await controller.saveMeals([testMeals.breakfast]);

      expect(hass.callService).toHaveBeenCalledWith(
        'mqtt',
        'publish',
        expect.objectContaining({
          topic: 'zigbee2mqtt/feeder/set',
          payload: expect.any(String),
        }),
      );
    });

    it('wraps payload when using wrapped encoder', async () => {
      // Use Aqara profile which has wrapper built into encoder
      const aqaraProfile = profiles.find((p) => p.manufacturer === 'Aqara');
      if (!aqaraProfile) throw new Error('Aqara profile not found');

      const hass = {
        states: {},
        callService: vi.fn(),
      };

      controller = new MealStateController(mockHost, aqaraProfile, hass, {
        sensor: 'sensor.feeder',
        manufacturer: 'Aqara',
        title: 'Test',
        portions: 6,
        transport_type: TransportType.MQTT,
      });

      await controller.saveMeals([testMeals.breakfast]);

      expect(hass.callService).toHaveBeenCalledWith(
        'mqtt',
        'publish',
        expect.objectContaining({
          topic: expect.any(String),
          payload: expect.stringContaining('schedule'),
        }),
      );

      // Verify payload is valid JSON with schedule wrapper
      const call = hass.callService.mock.calls[0];
      const payload = JSON.parse(call[2].payload);
      expect(payload).toHaveProperty('schedule');
      expect(Array.isArray(payload.schedule)).toBe(true);
    });

    it('uses sensor transport by default', async () => {
      const hass = {
        states: {},
        callService: vi.fn(),
      };

      controller = new MealStateController(mockHost, profile, hass, {
        sensor: 'sensor.test',
        manufacturer: 'Test',
        title: 'Test',
        portions: 6,
        transport_type: TransportType.SENSOR,
      });

      await controller.saveMeals([testMeals.breakfast]);

      // Should call sensor.set_value, not mqtt.publish
      expect(hass.callService).toHaveBeenCalledWith(
        'sensor',
        'set_value',
        expect.any(Object),
      );
      expect(hass.callService).not.toHaveBeenCalledWith(
        'mqtt',
        'publish',
        expect.any(Object),
      );
    });
  });
});

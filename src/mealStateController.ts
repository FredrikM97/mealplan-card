/**
 * Reactive controller for managing meal plan state
 * Implements Lit's ReactiveController pattern - calls host.requestUpdate() when state changes
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import {
  FeedingTime,
  DeviceProfile,
  MealPlanCardConfig,
  HomeAssistant,
  TransportType,
} from './types';
import { getEncoder, EncoderBase } from './profiles/serializer';
import { areMealsEqual } from './utils';

export class MealStateController implements ReactiveController {
  private _meals: FeedingTime[] = [];
  private subscribers = new Set<() => void>();

  // Getter/setter with notification
  get meals(): FeedingTime[] {
    return this._meals;
  }

  set meals(value: FeedingTime[]) {
    this._meals = value;
    this.notifySubscribers();
  }

  hass: HomeAssistant;
  profile: DeviceProfile;
  config: MealPlanCardConfig;
  private encoder: EncoderBase;
  private writeValue: (value: string) => Promise<void>;

  constructor(
    private host: ReactiveControllerHost,
    profile: DeviceProfile,
    hass: HomeAssistant,
    config: MealPlanCardConfig,
  ) {
    this.host.addController(this);
    this.profile = profile;
    this.hass = hass;
    this.config = config;
    this.encoder = getEncoder(profile);

    // Map transport type to write function
    this.writeValue = {
      [TransportType.SENSOR]: (value: string) => this.setSensorValue(value),
      [TransportType.MQTT]: (value: string) => this.publishMQTT(value),
    }[this.config.transport_type];

    // Load initial data after construction
    if (this.hass) {
      this.updateFromHass().catch((error) => {
        console.error(
          '[MealStateController] Failed to load initial data:',
          error,
        );
      });
    } else {
      console.warn(
        '[MealStateController] Initialized without hass object. Data loading will be skipped.',
      );
    }
  }

  hostConnected(): void {}

  /**
   * Subscribe to meals changes
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of changes
   */
  private notifySubscribers(): void {
    this.host.requestUpdate();
    this.subscribers.forEach((callback) => callback());
  }

  /**
   * Check if entity state is valid (not empty, unknown, or unavailable)
   */
  private isValidState(value: unknown): value is string {
    return (
      typeof value === 'string' &&
      value.trim() !== '' &&
      value !== 'unknown' &&
      value !== 'unavailable'
    );
  }

  /**
   * Get entity state value if valid
   */
  private getEntityValue(entityId: string): string | null {
    const state = this.hass.states?.[entityId];
    const value = state?.state;
    return this.isValidState(value) ? value : null;
  }

  /**
   * Set entity value via set_value service
   */
  private async setEntityValue(
    entityId: string | undefined,
    value: string,
  ): Promise<void> {
    if (!entityId) return;
    const domain = entityId.split('.')[0];
    if (!domain) return;
    await this.hass.callService(domain, 'set_value', {
      entity_id: entityId,
      value,
    });
  }

  /**
   * Update from Home Assistant - decode from sensor/helper
   */
  async updateFromHass(allowUpdate: boolean = true): Promise<void> {
    const sensorValue = this.getEntityValue(this.config.sensor);
    const helperValue = this.config.helper
      ? this.getEntityValue(this.config.helper)
      : null;

    let decodedMeals: FeedingTime[] | null = null;

    // Prefer sensor if valid
    if (sensorValue) {
      decodedMeals = this.encoder.decode(sensorValue);
    }
    // Fall back to helper
    else if (helperValue) {
      decodedMeals = this.encoder.decode(helperValue);
    }

    if (allowUpdate) {
      const newMeals = decodedMeals ? [...decodedMeals] : [];
      // Only update if meals have actually changed
      if (!areMealsEqual(decodedMeals, this.meals)) {
        this.meals = newMeals;
      } else {
        console.debug(
          '[MealStateController] Skipping update - meals unchanged',
        );
      }
    }
  }

  /**
   * Save meals to sensor and update local state
   */
  async saveMeals(meals: FeedingTime[]): Promise<void> {
    await this.writeValue(this.encoder.encode(meals));
    this.meals = [...meals];
  }

  /**
   * Set sensor value (and optionally helper for backup)
   */
  private async setSensorValue(value: string): Promise<void> {
    await this.setEntityValue(this.config.sensor, value);

    // Also sync helper if configured (for backup/persistence)
    if (this.config.helper) {
      await this.setEntityValue(this.config.helper, value);
    }
  }

  /**
   * Publish to MQTT
   */
  private async publishMQTT(value: string): Promise<void> {
    // Build topic from sensor entity ID
    const parts = this.config.sensor.split('.');
    const deviceName = parts[1]?.split('_')[0] || parts[1];
    const topic = `zigbee2mqtt/${deviceName}/set`;
    await this.hass.callService('mqtt', 'publish', {
      topic,
      payload: value,
    });
  }
}

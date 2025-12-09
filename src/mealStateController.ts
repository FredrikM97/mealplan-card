/**
 * Reactive controller for managing meal plan state
 * Implements Lit's ReactiveController pattern - calls host.requestUpdate() when state changes
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { FeedingTime, DeviceProfileGroup } from './types.js';
import { getEncoder, EncoderBase } from './profiles/serializer.js';
import {
  MealMessageEvent,
  MESSAGE_TYPE_ERROR,
  MESSAGE_TYPE_INFO,
} from './constants.js';

export class MealStateController implements ReactiveController {
  meals: FeedingTime[] = [];
  hass: any;
  profile: DeviceProfileGroup;
  private encoder: EncoderBase;

  constructor(
    private host: ReactiveControllerHost & EventTarget,
    private sensorID: string,
    profile: DeviceProfileGroup,
    hass: any,
    private helperID?: string,
  ) {
    this.host.addController(this);
    this.profile = profile;
    this.hass = hass;
    this.encoder = getEncoder(profile);
    
    // Load initial data after construction
    if (this.hass) {
      this.updateFromHass();
    } else {
      console.warn('[MealStateController] Initialized without hass object. Data loading will be skipped.');
    }
  }

  hostConnected(): void {
    // Controller is ready, data loading is triggered from constructor or when hass updates
  }

  /**
   * Set meals (updates local state - does not persist) - used by tests
   */
  setMeals(meals: FeedingTime[]): void {
    this.meals = Array.isArray(meals) ? [...meals] : [];
    this.host.requestUpdate();
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
   * Decode and sync sensor value
   */
  private async decodeFromSensor(
    sensorValue: string,
    helperValue: string | null,
  ): Promise<FeedingTime[] | null> {
    const decoded = this.encoder.decode(sensorValue);

    // Sync helper if out of sync
    if (decoded && helperValue && helperValue !== sensorValue) {
      await this.syncHelper(sensorValue);
    }

    return decoded;
  }

  /**
   * Sync helper to match sensor value
   */
  private async syncHelper(value: string): Promise<void> {
    if (!this.helperID) return;

    const domain = this.helperID.split('.')[0];
    await this.hass.callService(domain, 'set_value', {
      entity_id: this.helperID,
      value,
    });
  }

  /**
   * Update from Home Assistant - decode from sensor/helper
   */
  async updateFromHass(allowUpdate: boolean = true): Promise<void> {
    if (!this.hass) {
      this.host.dispatchEvent(
        new MealMessageEvent(
          'Home Assistant connection not available. Please refresh the page.',
          MESSAGE_TYPE_ERROR,
        ),
      );
      return;
    }

    const sensorValue = this.getEntityValue(this.sensorID);
    const helperValue = this.helperID
      ? this.getEntityValue(this.helperID)
      : null;

    // Early validation
    if (!sensorValue && !helperValue) {
      const infoMsg = this.helperID
        ? 'No valid meal plan data found. Both sensor and helper are empty or unavailable.'
        : 'No valid meal plan data found. Sensor is empty or unavailable. Consider configuring a helper (input_text) to store your meal plan.';
      this.host.dispatchEvent(new MealMessageEvent(infoMsg, MESSAGE_TYPE_INFO));
      if (allowUpdate) {
        this.meals = [];
        this.host.requestUpdate();
      }
      return;
    }

    let decodedMeals: FeedingTime[] | null = null;

    try {
      // Prefer sensor if valid
      if (sensorValue) {
        decodedMeals = await this.decodeFromSensor(sensorValue, helperValue);
      }
      // Fall back to helper
      else if (helperValue) {
        decodedMeals = this.encoder.decode(helperValue);
      }
    } catch (err) {
      decodedMeals = null;
    }

    // Show message if decode failed
    if (!decodedMeals && (sensorValue || helperValue)) {
      this.host.dispatchEvent(
        new MealMessageEvent('Failed to decode meal plan data.', MESSAGE_TYPE_INFO),
      );
    }

    if (allowUpdate) {
      this.meals = decodedMeals ? [...decodedMeals] : [];
      this.host.requestUpdate();
    }
  }

  /**
   * Save meals to sensor and update local state
   */
  async saveMeals(meals: FeedingTime[]): Promise<void> {
    if (!this.hass) {
      throw new Error('Cannot save: hass not initialized');
    }

    const value = this.encoder.encode(meals);

    const domain = this.sensorID.split('.')[0];
    await this.hass.callService(domain, 'set_value', {
      entity_id: this.sensorID,
      value,
    });

    // Update local state after successful save
    this.meals = [...meals];
    this.host.requestUpdate();
  }
}

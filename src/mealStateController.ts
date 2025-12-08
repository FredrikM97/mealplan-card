/**
 * Reactive controller for managing meal plan state
 * Implements Lit's ReactiveController pattern for automatic host updates
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { FeedingTime, DeviceProfileGroup } from './types.js';
import { getEncoder, EncoderBase } from './profiles/serializer.js';

export class MealStateController implements ReactiveController {
  private meals: FeedingTime[] = [];
  private persistedMeals: FeedingTime[] = [];
  private encoder: EncoderBase | null = null;
  private decodeError: string | null = null;
  private hass: any = null;

  constructor(
    private host: ReactiveControllerHost,
    private sensorID: string,
    profile: DeviceProfileGroup,
    private helperID?: string,
  ) {
    this.host.addController(this);
    this.encoder = getEncoder(profile);
  }

  // ReactiveController lifecycle hooks
  hostConnected(): void {
    // Called when host connects to DOM
  }

  hostDisconnected(): void {
    // Called when host disconnects from DOM
  }

  /**
   * Update hass reference (no UI update needed)
   */
  setHass(hass: any): void {
    this.hass = hass;
  }

  /**
   * Get current meals
   */
  getMeals(): FeedingTime[] {
    return this.meals;
  }

  /**
   * Get persisted meals (last saved state)
   */
  getPersistedMeals(): FeedingTime[] {
    return this.persistedMeals;
  }

  /**
   * Get decode error if any
   */
  getDecodeError(): string | null {
    return this.decodeError;
  }

  /**
   * Check if there are unsaved changes
   */
  hasPendingChanges(): boolean {
    return JSON.stringify(this.meals) !== JSON.stringify(this.persistedMeals);
  }

  /**
   * Set meals (for UI updates)
   */
  setMeals(meals: FeedingTime[]): void {
    this.meals = Array.isArray(meals) ? [...meals] : [];
    this.host.requestUpdate();
  }

  /**
   * Reset meals to last saved state
   */
  resetToSaved(): void {
    this.meals = Array.isArray(this.persistedMeals)
      ? [...this.persistedMeals]
      : [];
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
   * Decode meals from encoded string
   */
  private decodeMeals(encodedValue: string): FeedingTime[] | null {
    if (!this.encoder) return null;

    try {
      return this.encoder.decode(encodedValue);
    } catch (err) {
      console.warn('Failed to decode meal plan:', encodedValue, err);
      return null;
    }
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
      console.warn('Cannot update from hass: hass not initialized');
      return;
    }

    this.decodeError = null;

    const sensorValue = this.getEntityValue(this.sensorID);
    const helperValue = this.helperID
      ? this.getEntityValue(this.helperID)
      : null;

    let decodedMeals: FeedingTime[] | null = null;

    // Prefer sensor if valid
    if (sensorValue) {
      decodedMeals = this.decodeMeals(sensorValue);

      if (decodedMeals) {
        // Sync helper if out of sync
        if (helperValue && helperValue !== sensorValue) {
          await this.syncHelper(sensorValue);
        }
      } else {
        this.decodeError = 'Failed to decode meal plan data.';
      }
    }
    // Fall back to helper if sensor invalid
    else if (helperValue) {
      decodedMeals = this.decodeMeals(helperValue);

      if (!decodedMeals) {
        this.decodeError = 'Failed to decode meal plan data.';
      }
    }
    // Both invalid
    else {
      this.decodeError =
        'No valid meal plan data found: neither helper nor a valid sensor value is present.';
      console.warn(this.decodeError);
    }

    this.persistedMeals = decodedMeals || [];
    if (allowUpdate) {
      this.meals = decodedMeals ? [...decodedMeals] : [];
    }
    this.host.requestUpdate();
  }

  /**
   * Save current meals to sensor
   */
  async saveMeals(): Promise<void> {
    if (!this.encoder) {
      throw new Error('Cannot save: encoder not initialized');
    }

    if (!this.hass) {
      throw new Error('Cannot save: hass not initialized');
    }

    const value = this.encoder.encode(this.meals);
    console.debug('Saving meals to sensor', this.sensorID, value);

    const domain = this.sensorID.split('.')[0];
    await this.hass.callService(domain, 'set_value', {
      entity_id: this.sensorID,
      value,
    });

    // Update persisted state (UI will update via hass state change)
    this.persistedMeals = [...this.meals];
  }
}

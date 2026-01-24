/**
 * Reactive controller for managing meal plan state
 * Implements Lit's ReactiveController pattern - calls host.requestUpdate() when state changes
 */

import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { FeedingTime, DeviceProfile } from './types';
import type { HasGetter, MealPlanCardConfig, StorageAdapter } from './types';
import { createStorageAdapter } from './adapters/storage-adapter';
import { getEncoder, EncoderBase } from './profiles/serializer';
import { log } from './logger';
import { areMealsEqual } from './utils';

export class MealStateController implements ReactiveController {
  private _meals: FeedingTime[] = [];
  private subscribers = new Set<() => void>();

  hass: HasGetter;
  profile: DeviceProfile;
  config: MealPlanCardConfig;
  private encoder: EncoderBase;
  private adapter: StorageAdapter;

  get meals(): FeedingTime[] {
    return this._meals;
  }

  set meals(value: FeedingTime[]) {
    this._meals = value;
    log.debug('Notify subscribers of meals set to:', value);
    this.notifySubscribers();
  }

  constructor(
    private host: ReactiveControllerHost,
    profile: DeviceProfile,
    hass: HasGetter,
    config: MealPlanCardConfig,
  ) {
    this.host.addController(this);
    this.profile = profile;
    this.hass = hass;
    this.config = config;
    this.encoder = getEncoder(profile);
    this.adapter = createStorageAdapter(hass, config);

    // Load initial data after construction
    if (this.hass()) {
      this.updateFromHass().catch((error) => {
        log.error('Failed to load initial data:', error);
      });
    } else {
      log.warn(
        'Initialized without hass object. Data loading will be skipped.',
      );
    }
  }

  hostConnected(): void {}

  hostDisconnected(): void {
    this.subscribers.clear();
  }

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
   * Update from Home Assistant - decode from storage adapter
   */
  async updateFromHass(allowUpdate: boolean = true): Promise<void> {
    const value = await this.adapter.read();
    let decodedMeals: FeedingTime[] | null = null;

    if (value) {
      decodedMeals = this.encoder.decode(value);
    }

    if (allowUpdate) {
      const newMeals = decodedMeals ? [...decodedMeals] : [];
      // Only update if meals have actually changed
      if (!areMealsEqual(decodedMeals, this.meals)) {
        this.meals = newMeals;
      } else {
        log.debug('Skipping update - meals unchanged', this.meals);
      }
    }
  }

  /**
   * Save meals to storage via adapter, then update local state
   */
  async saveMeals(meals: FeedingTime[]): Promise<void> {
    const encoded = this.encoder.encode(meals);
    await this.adapter.write(encoded);
    this.meals = [...meals];
  }

  public async isDataAvailable(): Promise<boolean> {
    try {
      const value = await this.adapter.read();
      const available = value !== null && value !== undefined;

      if (!available) {
        log.warn(
          '[MealStateController] Data not available - adapter returned empty value',
        );
      }

      return available;
    } catch (error) {
      log.warn(
        '[MealStateController] Failed to read data from adapter:',
        error,
      );
      return false;
    }
  }
}

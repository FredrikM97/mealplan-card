/**
 * Event names used throughout the application
 */
import type { MealPlanCardConfig, EditMealState } from './types';

export const EVENT_CONFIG_CHANGED = 'config-changed';
export const EVENT_VALUE_CHANGED = 'value-changed';
export const EVENT_SCHEDULE_CLOSED = 'schedule-closed';
export const EVENT_SAVE = 'save';
export const EVENT_EDIT_MEAL = 'edit-meal';
export const EVENT_DELETE_MEAL = 'delete-meal';
export const EVENT_MEAL_CHANGED = 'meal-changed';

/**
 * Message types
 */
export const MESSAGE_TYPE_ERROR = 'error' as const;
export const MESSAGE_TYPE_INFO = 'info' as const;

export type MessageType = typeof MESSAGE_TYPE_ERROR | typeof MESSAGE_TYPE_INFO;

/**
 * Custom event types
 */
export class ConfigChangedEvent extends CustomEvent<{
  config: MealPlanCardConfig;
}> {
  constructor(config: MealPlanCardConfig) {
    super(EVENT_CONFIG_CHANGED, {
      detail: { config },
      bubbles: true,
      composed: true,
    });
  }
}

export class SaveEvent extends CustomEvent<EditMealState> {
  constructor(detail: EditMealState) {
    super(EVENT_SAVE, {
      detail,
      bubbles: true,
      composed: true,
    });
  }
}

export class ScheduleClosedEvent extends CustomEvent<void> {
  constructor() {
    super(EVENT_SCHEDULE_CLOSED, {
      detail: undefined,
      bubbles: true,
      composed: true,
    });
  }
}

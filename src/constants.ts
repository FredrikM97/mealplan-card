/**
 * Event names used throughout the application
 */
import type { MealPlanCardConfig, FeedingTime } from './types.js';

export const EVENT_CONFIG_CHANGED = 'config-changed';
export const EVENT_MEAL_MESSAGE = 'meal-message';
export const EVENT_CLEAR_MESSAGE = 'clear-message';
export const EVENT_SCHEDULE_CLOSED = 'schedule-closed';
export const EVENT_SAVE = 'save';

/**
 * Message types
 */
export const MESSAGE_TYPE_ERROR = 'error' as const;
export const MESSAGE_TYPE_INFO = 'info' as const;

export type MessageType = typeof MESSAGE_TYPE_ERROR | typeof MESSAGE_TYPE_INFO;

/**
 * Custom event types
 */
export class MealMessageEvent extends CustomEvent<{
  message: string;
  type: MessageType;
}> {
  constructor(message: string, messageType: MessageType = MESSAGE_TYPE_INFO) {
    super(EVENT_MEAL_MESSAGE, {
      detail: { message, type: messageType },
      bubbles: true,
      composed: true,
    });
  }
}

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

export class SaveEvent extends CustomEvent<{
  meal: FeedingTime;
  index?: number;
}> {
  constructor(meal: FeedingTime, index?: number) {
    super(EVENT_SAVE, {
      detail: { meal, index },
      bubbles: true,
      composed: true,
    });
  }
}

export class ScheduleClosedEvent extends CustomEvent<void> {
  constructor() {
    super(EVENT_SCHEDULE_CLOSED, {
      bubbles: true,
      composed: true,
    });
  }
}

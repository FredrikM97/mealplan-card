export const log = {
  debug: (message: string, ...args: unknown[]) => {
    if (LOG_LEVEL <= LogLevel.DEBUG) {
      console.debug(`[mealplan-card] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (LOG_LEVEL <= LogLevel.INFO) {
      console.info(`[mealplan-card] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (LOG_LEVEL <= LogLevel.WARN) {
      console.warn(`[mealplan-card] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[mealplan-card] ${message}`, ...args);
  },
};

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Set to INFO by default (only shows info, warn, error - hides debug)
const LOG_LEVEL = LogLevel.INFO;

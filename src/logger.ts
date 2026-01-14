const makeLogger = (prefix: string) => {
  const withPrefix =
    (fn: (...args: unknown[]) => void) =>
    (...args: unknown[]) =>
      fn(prefix, ...args);

  return {
    debug: withPrefix(console.debug),
    info: withPrefix(console.info),
    warn: withPrefix(console.warn),
    error: withPrefix(console.error),
  } as const;
};

export const log = makeLogger('[MealPlanCard]');

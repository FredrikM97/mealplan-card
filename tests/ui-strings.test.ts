import { describe, expect, it } from 'vitest';
import { UI_STRINGS } from '../src/cleverio/ui-strings';

describe('UI_STRINGS', () => {
  it('exports expected keys and values', () => {
    expect(UI_STRINGS.FEED_NOW).toBe('Feed Now');
    expect(UI_STRINGS.SCHEDULE).toBe('Schedule');
    expect(UI_STRINGS.PORTION).toBe('Portion');
    expect(UI_STRINGS.DAYS).toBe('Days');
    expect(UI_STRINGS.ENABLED).toBe('Enabled');
  });
});

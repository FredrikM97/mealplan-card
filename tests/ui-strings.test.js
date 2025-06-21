import { UI_STRINGS } from '../src/cleverio/ui-strings.js';

describe('UI_STRINGS', () => {
  it('exports expected keys and values', () => {
    expect(UI_STRINGS.FEED_NOW).to.equal('Feed Now');
    expect(UI_STRINGS.SCHEDULE).to.equal('Schedule');
    expect(UI_STRINGS.PORTION).to.equal('Portion');
    expect(UI_STRINGS.DAYS).to.equal('Days');
    expect(UI_STRINGS.ENABLED).to.equal('Enabled');
  });
});

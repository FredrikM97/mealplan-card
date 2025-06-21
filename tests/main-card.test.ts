import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/main';
import { describe, it } from 'vitest';

describe('CleverioPf100Card', () => {
  it('renders the main card with minimal config and shows UI', async () => {
    const config = { sensor: 'sensor.test', title: 'Test Card' };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config}></cleverio-pf100-card>`);
    await el.updateComplete;
    // Check for ha-card or main UI element
    const haCard = el.shadowRoot && el.shadowRoot.querySelector('ha-card');
    expect(haCard).to.exist;
    // Optionally check for title or other visible text
    if (haCard) {
      expect(haCard.textContent).to.match(/Test Card|Cleverio/i);
    }
  });
});

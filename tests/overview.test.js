import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/overviews.js';

describe('CleverioOverviewView', () => {
  it('renders with default title and no meals', async () => {
    const el = await fixture(html`<cleverio-overview-view></cleverio-overview-view>`);
    await el.updateComplete;
    const title = el.shadowRoot.querySelector('.overview-title');
    expect(title).to.exist;
    expect(title.textContent).to.include('Cleverio Pet Feeder');
  });
});

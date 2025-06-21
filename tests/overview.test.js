import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/overviews.js';

describe('CleverioOverviewView', () => {
  it('renders with default title and no meals', async () => {
    const el = await fixture(html`<cleverio-overview-view></cleverio-overview-view>`);
    await el.updateComplete;
    const title = el.shadowRoot.querySelector('.overview-title');
    expect(title).to.exist;
    expect(title.textContent).to.include('Cleverio Pet Feeder');
    expect(el.shadowRoot.textContent).to.include('Schedules: 0');
    expect(el.shadowRoot.textContent).to.include('Active schedules: 0');
  });

  it('renders with custom title and meals', async () => {
    const meals = [
      { time: '08:00', portion: 1, daysMask: 31, enabled: true },
      { time: '12:00', portion: 2, daysMask: 127, enabled: false }
    ];
    const el = await fixture(html`<cleverio-overview-view .meals=${meals} title="My Feeder"></cleverio-overview-view>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.overview-title').textContent).to.include('My Feeder');
    expect(el.shadowRoot.textContent).to.include('Schedules: 2');
    expect(el.shadowRoot.textContent).to.include('Active schedules: 1');
  });

  it('fires manage-schedules event when button is clicked', async () => {
    const el = await fixture(html`<cleverio-overview-view></cleverio-overview-view>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.manage-btn');
    setTimeout(() => btn.click());
    const e = await oneEvent(el, 'manage-schedules');
    expect(e).to.exist;
  });
});

import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/overview';
import { describe, it } from 'vitest';

const sampleMeals = [
  { time: '08:00', portion: 2, daysMask: 127, enabled: true },
  { time: '18:00', portion: 1, daysMask: 62, enabled: false }
];

describe('overviews', () => {
  it('renders with default title and no meals', async () => {
    const el = await fixture<HTMLElement>(html`<cleverio-overview-view></cleverio-overview-view>`);
    await (el as any).updateComplete;
    const title = (el.shadowRoot as ShadowRoot).querySelector('.overview-title');
    expect(title).to.exist;
    expect(title!.textContent).to.include('Cleverio Pet Feeder');
  });

  it('shows dialog and schedule view when manage button is clicked', async () => {
    const el = await fixture<any>(html`<cleverio-overview-view .meals=${sampleMeals}></cleverio-overview-view>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.manage-btn');
    btn.click();
    await el.updateComplete;
    const dialog = el.shadowRoot.querySelector('ha-dialog');
    expect(dialog).to.exist;
    const scheduleView = dialog.querySelector('schedule-view');
    expect(scheduleView).to.exist;
    expect(scheduleView.meals.length).to.equal(2);
  });

  it('closes dialog when close event is fired', async () => {
    const el = await fixture<any>(html`<cleverio-overview-view .meals=${sampleMeals}></cleverio-overview-view>`);
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.manage-btn');
    btn.click();
    await el.updateComplete;
    const dialog = el.shadowRoot.querySelector('ha-dialog');
    dialog.dispatchEvent(new CustomEvent('closed', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ha-dialog')).to.not.exist;
  });
});

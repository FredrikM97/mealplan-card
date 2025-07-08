import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/day-selector';
import { describe, it } from 'vitest';

describe('CleverioDaySelector', () => {
  it('renders 7 day cells', async () => {
    const el = await fixture(html`<cleverio-day-selector .selectedDaysMask=${0}></cleverio-day-selector>`);
    await (el as any).updateComplete;
    const cells = el.shadowRoot!.querySelectorAll('.day-cell');
    expect(cells.length).to.equal(7);
  });

  it('highlights selected days', async () => {
    // Select Monday (bit 0) and Wednesday (bit 2)
    const mask = 0b00000101;
    const el = await fixture(html`<cleverio-day-selector .selectedDaysMask=${mask}></cleverio-day-selector>`);
    await (el as any).updateComplete;
    const selected = el.shadowRoot!.querySelectorAll('.day-cell.selected');
    expect(selected.length).to.equal(2);
  });

  it('emits days-changed event when a day is clicked in editable mode', async () => {
    const el = await fixture(html`<cleverio-day-selector .selectedDaysMask=${0} .editable=${true}></cleverio-day-selector>`);
    await (el as any).updateComplete;
    const cells = el.shadowRoot!.querySelectorAll('.day-cell');
    setTimeout(() => (cells[0] as HTMLElement).click());
    const e = await oneEvent(el, 'days-changed');
    expect(e.detail.daysMask & 1).to.equal(1); // Monday toggled
  });

  it('does not emit days-changed event when not editable', async () => {
    const el = await fixture(html`<cleverio-day-selector .selectedDaysMask=${0} .editable=${false}></cleverio-day-selector>`);
    await (el as any).updateComplete;
    const cells = el.shadowRoot!.querySelectorAll('.day-cell');
    let fired = false;
    el.addEventListener('days-changed', () => { fired = true; });
    (cells[0] as HTMLElement).click();
    await new Promise(r => setTimeout(r, 50));
    expect(fired).to.be.false;
  });
});

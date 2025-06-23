import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/schedule';
import { describe, it } from 'vitest';
import { ScheduleView } from '../src/cleverio/schedule';
import { vi } from 'vitest';
import './setup';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {}
}));

const sampleMeals = [
  { time: '08:00', portion: 2, daysMask: 127, enabled: true },
  { time: '18:00', portion: 1, daysMask: 62, enabled: false }
];

function nextFrame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

describe('schedule', () => {
  it('passes correct data and columns to ha-data-table', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true; // Force ready for test
    await el.updateComplete;
    await nextFrame();
    const table = el.shadowRoot!.querySelector('ha-data-table') as any;
    expect(table).to.exist;
    expect(table.data).to.have.lengthOf(2);
    expect(table.data[0].time).to.equal('08:00');
    expect(table.data[1].portion).to.equal(1);
    expect(Object.keys(table.columns)).to.include.members(['time', 'portion', 'days', 'enabled', 'actions']);
  }, 2000);

  it('switches to edit view when edit is called (simulated)', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true; // Force ready for test
    await el.updateComplete;
    await nextFrame();
    // Simulate opening the edit dialog directly
    (el as any)._openEditDialog(0);
    await el.updateComplete;
    await nextFrame();
    const editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.exist;
    // Simulate save event
    if (editView) {
      editView.dispatchEvent(new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail: { meal: sampleMeals[0] }
      }));
      await el.updateComplete;
      await nextFrame();
      expect(el.shadowRoot!.querySelector('cleverio-edit-view')).to.not.exist;
    }
  }, 2000);
});

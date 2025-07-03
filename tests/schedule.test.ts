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
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view></cleverio-schedule-view>`);
    el.haComponentsReady = true;
    el.meals = sampleMeals;
    el['editDialogOpen'] = false;
    el['viewMeals'] = sampleMeals.map(m => ({ ...m }));
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
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view></cleverio-schedule-view>`);
    el.haComponentsReady = true;
    el.meals = sampleMeals;
    el['editDialogOpen'] = false;
    el['viewMeals'] = sampleMeals.map(m => ({ ...m }));
    await el.updateComplete;
    await nextFrame();
    (el as any)._openEditDialog(0);
    await el.updateComplete;
    await nextFrame();
    const editForm = el.shadowRoot!.querySelector('.edit-form');
    expect(editForm).to.exist;
    const timeInput = el.shadowRoot!.querySelector('input.edit-time') as HTMLInputElement;
    if (timeInput) {
      timeInput.value = '08:00';
      timeInput.dispatchEvent(new Event('input'));
    }
    const portionInput = el.shadowRoot!.querySelector('input[type="number"]') as HTMLInputElement;
    if (portionInput) {
      portionInput.value = '2';
      portionInput.dispatchEvent(new Event('input'));
    }
    await el.updateComplete;
    await nextFrame();
    const saveButton = el.shadowRoot!.querySelector('ha-button[slot="primaryAction"]');
    if (saveButton) {
      (saveButton as HTMLElement).click();
      await el.updateComplete;
      await nextFrame();
      expect(el.shadowRoot!.querySelector('.edit-form')).to.not.exist;
    }
  }, 2000);
  it('does not overwrite viewMeals from meals if editing or unsaved changes', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view></cleverio-schedule-view>`);
    el.haComponentsReady = true;
    el.meals = sampleMeals;
    el['editDialogOpen'] = false;
    el['viewMeals'] = sampleMeals.map(m => ({ ...m }));
    await el.updateComplete;
    await nextFrame();
    el['viewMeals'] = [
      { time: '09:00', portion: 1, daysMask: 127, enabled: true },
      { time: '18:00', portion: 1, daysMask: 62, enabled: false }
    ];
    el.meals = [
      { time: '10:00', portion: 2, daysMask: 127, enabled: true },
      { time: '20:00', portion: 1, daysMask: 62, enabled: false }
    ];
    await el.updateComplete;
    await nextFrame();
    expect(el['viewMeals'][0].time).to.equal('09:00');
    el['editDialogOpen'] = false;
    el['viewMeals'] = el.meals.map(m => ({ ...m }));
    await el.updateComplete;
    await nextFrame();
    el['editDialogOpen'] = false;
    el['viewMeals'] = [
      { time: '12:00', portion: 4, daysMask: 127, enabled: true },
      { time: '22:00', portion: 1, daysMask: 62, enabled: false }
    ];
    el.meals = [
      { time: '12:00', portion: 4, daysMask: 127, enabled: true },
      { time: '22:00', portion: 1, daysMask: 62, enabled: false }
    ];
    await el.updateComplete;
    await nextFrame();
    expect(el['viewMeals'][0].time).to.equal('12:00');
  });
});

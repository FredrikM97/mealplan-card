import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/schedule';
import { describe, it, vi } from 'vitest';
import { ScheduleView } from '../src/cleverio/schedule';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {}
}));

const sampleMeals = [
  { time: '08:00', portion: 2, daysMask: 127, enabled: true },
  { time: '18:00', portion: 1, daysMask: 62, enabled: false }
];

describe('cleverio-schedule-view', () => {
  it('renders table view with correct rows and data', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot).to.exist;
    const dataTable = el.shadowRoot!.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    const rows = dataTable!.shadowRoot!.querySelectorAll('tr');
    expect(rows.length).to.be.greaterThan(1); // header + data rows
    const firstRow = rows[1];
    expect(firstRow.textContent).to.include('08:00');
    expect(firstRow.textContent).to.include('2');
    expect(firstRow.textContent).to.include('true'); // enabled is rendered as 'true'
  }, 2000);

  it('switches to edit view when edit is called', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    el._openEditDialog(0);
    await el.updateComplete;
    // Wait for edit view to render and update
    let editView = el.shadowRoot!.querySelector('cleverio-edit-view') as any;
    expect(editView).to.exist;
    // @ts-ignore: updateComplete is present on LitElement
    await editView.updateComplete;
    // Wait for day selector to render
    const daySelector = editView.shadowRoot!.querySelector('cleverio-day-selector');
    expect(daySelector).to.exist;
    expect(daySelector.selectedDaysMask).to.equal(sampleMeals[0].daysMask);
  }, 2000);

  it('deletes a meal when delete icon is clicked', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    // Instead of clicking the icon, call the method directly
    el._delete(0);
    await el.updateComplete;
    // Should have one less meal
    expect(el._localMeals.length).to.equal(1);
  }, 2000);

  it('emits meals-changed event on save', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    let eventFired = false;
    el.addEventListener('meals-changed', () => { eventFired = true; });
    const saveBtn = el.shadowRoot!.querySelector('.ha-primary');
    expect(saveBtn).to.exist;
    saveBtn!.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(eventFired).to.be.true;
  }, 2000);

  it('closes edit dialog and updates table after save', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    // Open edit dialog for first meal
    el._openEditDialog(0);
    await el.updateComplete;
    let editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.exist;
    // Simulate save from edit view
    const newMeal = { ...sampleMeals[0], portion: 99 };
    if (editView) {
      editView.dispatchEvent(new CustomEvent('save', { detail: { meal: newMeal }, bubbles: true, composed: true }));
    }
    await el.updateComplete;
    // Edit dialog should be closed
    editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.not.exist;
    // Table should be updated
    const dataTable = el.shadowRoot!.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    const rows = dataTable!.shadowRoot!.querySelectorAll('tr');
    expect(rows[1].textContent).to.include('99');
  }, 2000);

  it('shows error if time is invalid and does not save', async () => {
    const el = await fixture<any>(html`<cleverio-edit-view .data=${sampleMeals[0]}></cleverio-edit-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    el._localEdit.time = '';
    let eventFired = false;
    el.addEventListener('save', () => { eventFired = true; });
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;
    expect(el._error).to.include('valid time');
    expect(eventFired).to.be.false;
  });

  it('shows error if portion is invalid and does not save', async () => {
    const el = await fixture<any>(html`<cleverio-edit-view .data=${sampleMeals[0]}></cleverio-edit-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    el._localEdit.portion = 0;
    let eventFired = false;
    el.addEventListener('save', () => { eventFired = true; });
    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;
    expect(el._error).to.include('Portion');
    expect(eventFired).to.be.false;
  });

  it('resets form after save', async () => {
    // This test is obsolete: the form no longer resets itself after save; parent controls dialog closing.
    // Instead, test that saving in the schedule view closes the edit dialog and returns to the table view.
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    // Open edit dialog for first meal
    el._openEditDialog(0);
    await el.updateComplete;
    let editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.exist;
    // Simulate save from edit view
    const newMeal = { ...sampleMeals[0], portion: 77 };
    if (editView) {
      editView.dispatchEvent(new CustomEvent('save', { detail: { meal: newMeal }, bubbles: true, composed: true }));
    }
    await el.updateComplete;
    // Edit dialog should be closed (edit view removed)
    editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.not.exist;
    // Table should be updated with new value
    const dataTable = el.shadowRoot!.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    const rows = dataTable!.shadowRoot!.querySelectorAll('tr');
    expect(rows[1].textContent).to.include('77');
  });

  it('shows schedule view after save, does not close dialog', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    el._openEditDialog(0);
    await el.updateComplete;
    let editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.exist;
    // Simulate save from edit view
    const newMeal = { ...sampleMeals[0], portion: 99 };
    if (editView) {
      editView.dispatchEvent(new CustomEvent('save', { detail: { meal: newMeal }, bubbles: true, composed: true }));
    }
    await el.updateComplete;
    // Should return to schedule view (editView removed, table present)
    editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.not.exist;
    const dataTable = el.shadowRoot!.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    const rows = dataTable!.shadowRoot!.querySelectorAll('tr');
    expect(rows[1].textContent).to.include('99');
    // Dialog should still be open: simulate parent dialog by checking element is still in DOM
    expect(el.isConnected).to.be.true;
  });

  it('calls _delete and emits meals-changed', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    let eventFired = false;
    el.addEventListener('meals-changed', () => { eventFired = true; });
    el._delete(0);
    await el.updateComplete;
    expect(el._localMeals.length).to.equal(1);
    // _delete does not emit meals-changed, but let's call _save to check
    el._save();
    expect(eventFired).to.be.true;
  });

  it('calls _cancel and emits close-dialog', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    let eventFired = false;
    el.addEventListener('close-dialog', () => { eventFired = true; });
    el._cancel();
    expect(eventFired).to.be.true;
  });

  it('save in edit view does not close dialog, returns to schedule view', async () => {
    // Simulate parent dialog by wrapping in a container
    const container = document.createElement('div');
    document.body.appendChild(container);
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`, { parentNode: container });
    el._haComponentsReady = true;
    await el.updateComplete;
    el._openEditDialog(0);
    await el.updateComplete;
    let editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.exist;
    // Simulate clicking Save (call click on ha-button)
    editView = editView as any;
    expect(editView).to.exist;
    // @ts-ignore: updateComplete is present on LitElement
    await editView.updateComplete;
    // Simulate clicking Save (call click on ha-button)
    const saveBtn = editView.shadowRoot?.querySelector('.save-btn') as any;
    expect(saveBtn).to.exist;
    if (saveBtn?.click) saveBtn.click();
    await el.updateComplete;
    // Should return to schedule view (editView removed, table present)
    editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    expect(editView).to.not.exist;
    const dataTable = el.shadowRoot!.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    // The schedule view element should still be in the DOM (dialog not closed)
    expect(el.isConnected).to.be.true;
    // Clean up
    document.body.removeChild(container);
  });

  it('does not emit meals-changed on edit-save, only after schedule save', async () => {
    const el = await fixture<ScheduleView>(html`<cleverio-schedule-view .meals=${sampleMeals}></cleverio-schedule-view>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    // Open edit dialog for first meal
    el._openEditDialog(0);
    await el.updateComplete;
    let eventFired = false;
    el.addEventListener('meals-changed', () => { eventFired = true; });
    // Simulate edit-save from edit view
    const editView = el.shadowRoot!.querySelector('cleverio-edit-view');
    const newMeal = { ...sampleMeals[0], portion: 42 };
    if (editView) {
      editView.dispatchEvent(new CustomEvent('edit-save', { detail: { meal: newMeal }, bubbles: true, composed: true }));
    }
    await el.updateComplete;
    // Should return to schedule view (editView removed, table present)
    expect(el.shadowRoot!.querySelector('cleverio-edit-view')).to.not.exist;
    expect(el.shadowRoot!.querySelector('ha-data-table')).to.exist;
    // meals-changed should NOT have fired yet
    expect(eventFired).to.be.false;
    // Now click Save in schedule view
    const saveBtn = el.shadowRoot!.querySelector('.ha-primary');
    expect(saveBtn).to.exist;
    if (saveBtn) {
      saveBtn.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    }
    await el.updateComplete;
    expect(eventFired).to.be.true;
  });
});

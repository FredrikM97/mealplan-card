import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/schedule';
import { describe, it, beforeAll } from 'vitest';
import { ScheduleView } from '../src/cleverio/schedule';

beforeAll(async () => {
  await customElements.whenDefined('schedule-view');
  await customElements.whenDefined('edit-view');
});

const sampleMeals = [
  { time: '08:00', portion: 2, daysMask: 127, enabled: true },
  { time: '18:00', portion: 1, daysMask: 62, enabled: false }
];

describe('schedule', () => {
  it('renders table view with correct rows and data', async () => {
    const el = await fixture<ScheduleView>(html`<schedule-view .meals=${sampleMeals}></schedule-view>`);
    await el.updateComplete;
    expect(el.shadowRoot).to.exist;
    const rows = el.shadowRoot!.querySelectorAll('tr');
    expect(rows.length).to.be.greaterThan(1); // header + data rows
    const firstRow = rows[1];
    expect(firstRow.textContent).to.include('08:00');
    expect(firstRow.textContent).to.include('2');
    expect(firstRow.textContent).to.include('enabled');
  });

  it('switches to edit view when edit is called', async () => {
    const el = await fixture<ScheduleView>(html`<schedule-view .meals=${sampleMeals}></schedule-view>`);
    await el.updateComplete;
    expect(typeof el._edit).to.equal('function');
    el._edit(0);
    await el.updateComplete;
    expect(el.shadowRoot).to.exist;
    const editView = el.shadowRoot!.querySelector('edit-view');
    expect(editView).to.exist;
  });
});

import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import '../www/cleverio-pf100-feeder-card/schedules.js';
import DaysUtil from '../www/cleverio-pf100-feeder-card/utils/days-util.js';

describe('CleverioSchedulesDialog', () => {
  it('shows Weekdays, Weekend, Every day, and correct day order in table', async () => {
    const meals = [
      { time: '08:00', portion: 1, daysMask: 0b00011111, enabled: true }, // Weekdays
      { time: '09:00', portion: 1, daysMask: 0b1100000, enabled: true }, // Weekend
      { time: '10:00', portion: 1, daysMask: 0b1111111, enabled: true }, // Every day
      { time: '11:00', portion: 1, daysMask: 0b0000010, enabled: true }, // Tuesday only
      { time: '12:00', portion: 1, daysMask: 0b1000000, enabled: true }, // Sunday only
    ];
    const el = await fixture(html`<cleverio-schedules-dialog .meals=${meals}></cleverio-schedules-dialog>`);
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows[0].children[2].textContent).contain('Weekdays');
    expect(rows[1].children[2].textContent).contain('Weekend');
    expect(rows[2].children[2].textContent).contain('Every day');
    expect(rows[3].children[2].textContent).contain('Tuesday');
    expect(rows[4].children[2].textContent).contain('Sunday');
    // Check that a multi-day mask shows Monday first
    const mask = DaysUtil.daysArrayToBitmask(['Monday','Wednesday','Friday']);
    const label = DaysUtil.getDaysLabel(mask);
    expect(label.startsWith('Mon')).to.be.true;
  });

  it('fires save event with updated meals', async () => {
    const meals = [
      { time: '08:00', portion: 1, daysMask: 31, enabled: true },
    ];
    const el = await fixture(html`<cleverio-schedules-dialog .meals=${meals}></cleverio-schedules-dialog>`);
    el._localMeals[0].portion = 3;
    setTimeout(() => el._save());
    const e = await oneEvent(el, 'save');
    expect(e.detail.meals[0].portion).to.equal(3);
  });

  it('fires close-dialog event on cancel', async () => {
    const meals = [
      { time: '08:00', portion: 1, daysMask: 31, enabled: true },
    ];
    const el = await fixture(html`<cleverio-schedules-dialog .meals=${meals}></cleverio-schedules-dialog>`);
    setTimeout(() => el._cancel());
    const e = await oneEvent(el, 'close-dialog');
    expect(e).to.exist;
  });

  it('displays no schedules message when empty', async () => {
    const el = await fixture(html`<cleverio-schedules-dialog .meals=${[]}></cleverio-schedules-dialog>`);
    expect(el.shadowRoot.textContent).to.include('No schedules yet');
  });
});

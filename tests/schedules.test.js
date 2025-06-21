import { CleverioSchedulesView } from '../src/cleverio/Schedules.js';
import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import DaysUtil from '../src/cleverio/util/days-util.js';

describe('CleverioSchedulesView', () => {
  it('shows Weekdays, Weekend, Every day, and correct day order in table', async () => {
    const meals = [
      { time: '08:00', portion: 1, daysMask: 0b00011111, enabled: true }, // Weekdays
      { time: '09:00', portion: 1, daysMask: 0b1100000, enabled: true }, // Weekend
      { time: '10:00', portion: 1, daysMask: 0b1111111, enabled: true }, // Every day
      { time: '11:00', portion: 1, daysMask: 0b0000010, enabled: true }, // Tuesday only
      { time: '12:00', portion: 1, daysMask: 0b1000000, enabled: true }, // Sunday only
    ];
    const el = new CleverioSchedulesView();
    el.meals = meals;
    document.body.appendChild(el);
    await el.updateComplete;
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
    el.remove();
  });

  // Add more tests for CleverioSchedulesView as needed
});

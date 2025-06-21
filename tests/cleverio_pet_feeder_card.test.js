import '../src/cleverio/main.js';
import { encodeMealPlanData, decodeMealPlanData } from '../src/cleverio/util/mealplan-state.js';
import DaysUtil from '../src/cleverio/util/days-util.js';

describe("CleverioPF100Card", () => {
  let card;
  beforeEach(() => {
    card = new CleverioPf100Card();
    document.body.appendChild(card);
  });
  afterEach(() => {
    card.remove();
  });

  test("decodeMealPlanData returns empty array for unknown", () => {
    expect(decodeMealPlanData('unknown')).toEqual([]);
  });

  test("encodeMealPlanData and decodeMealPlanData are inverses", () => {
    const feedingTimes = [
      { time: "08:00", daysMask: DaysUtil.daysArrayToBitmask(["Monday", "Wednesday"]), portion: 2, enabled: true, status: 1 },
      { time: "18:30", daysMask: DaysUtil.daysArrayToBitmask(["Friday"]), portion: 1, enabled: false, status: 0 }
    ];
    const encoded = encodeMealPlanData(feedingTimes);
    const decoded = decodeMealPlanData(encoded);
    expect(decoded.length).toBe(2);
    expect(decoded[0].time).toBe("08:00");
    expect(DaysUtil.bitmaskToDaysArray(decoded[0].daysMask)).toContain("Monday");
    expect(decoded[0].portion).toBe(2);
    expect(decoded[0].enabled).toBe(true);
    expect(decoded[1].enabled).toBe(false);
  });

  test("getNextSchedule returns '-' if no enabled times", () => {
    card.feedingTimes = [
      { time: "10:00", daysMask: 0, portion: 1, enabled: false, status: 0 }
    ];
    expect(card.getNextSchedule()).toBe("-");
  });

  test("getTotalFoodPerDay returns correct totals", () => {
    card.feedingTimes = [
      { time: "10:00", daysMask: DaysUtil.daysArrayToBitmask(["Monday"]), portion: 2, enabled: true, status: 1 },
      { time: "12:00", daysMask: DaysUtil.daysArrayToBitmask(["Monday"]), portion: 1, enabled: false, status: 0 }
    ];
    const totals = card.getTotalFoodPerDay();
    expect(totals["Monday"]).toBe(2);
  });

  it('fires manage-schedules event from overview', async () => {
    card.setConfig({ sensor: 'sensor.test' });
    let fired = false;
    const overview = card.shadowRoot.querySelector('cleverio-overview-view');
    overview.addEventListener('manage-schedules', () => { fired = true; });
    await overview.updateComplete;
    const btn = overview.shadowRoot.querySelector('.manage-btn');
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(fired).to.be.true;
  });

  it('renders schedules dialog on manage', async () => {
    card.setConfig({ sensor: 'sensor.test' });
    const overview = card.shadowRoot.querySelector('cleverio-overview-view');
    await overview.updateComplete;
    const btn = overview.shadowRoot.querySelector('.manage-btn');
    btn.click();
    await new Promise(r => setTimeout(r, 50));
    expect(card.shadowRoot.querySelector('cleverio-schedules-dialog')).to.exist;
  });
});

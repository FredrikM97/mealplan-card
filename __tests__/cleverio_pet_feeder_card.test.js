import '../www/cleverio-pf100-feeder-card/cleverio_pet_feeder_card.js';
import { encodeMealPlanData, decodeMealPlanData } from '../www/cleverio-pf100-feeder-card/utils/mealplan-state.js';
import DaysUtil from '../www/cleverio-pf100-feeder-card/utils/days-util.js';

describe("CleverioPF100Card", () => {
  let card;
  beforeEach(() => {
    card = document.createElement('cleverio-pf100-card');
    document.body.appendChild(card);
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
});

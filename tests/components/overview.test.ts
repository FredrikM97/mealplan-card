import { fixture, html, expect } from '@open-wc/testing';
import '../../src/components/overview';
import { describe, it } from 'vitest';
import {
  getTodaysFoodGrams,
  getWeeklyAveragePortion,
} from '../../src/components/overview';
import type { FeedingTime } from '../../src/types';
import { testMeals, daySpecificMeals } from '../fixtures/data';
import { createMealStateController } from '../fixtures/factories';

describe('Overview Component', () => {
  describe('Component Rendering', () => {
    it('displays all overview chips with meal data', async () => {
      const mealState = createMealStateController([testMeals.breakfast]);

      const component = await fixture<HTMLElement>(
        html`<meal-overview .mealState=${mealState}></meal-overview>`,
      );

      await (component as unknown as { updateComplete: Promise<boolean> })
        .updateComplete;

      expect(component.shadowRoot?.querySelector('.overview-schedules')).to
        .exist;
      expect(component.shadowRoot?.querySelector('.overview-active')).to.exist;
      expect(component.shadowRoot?.querySelector('.overview-grams')).to.exist;
      expect(component.shadowRoot?.querySelector('.overview-average')).to.exist;
    });

    it('multiplies meal portions by configured portion multiplier', async () => {
      const mealState = createMealStateController([testMeals.breakfast]);

      // 10g meal × 3 portions = 30g total
      const component = await fixture<HTMLElement>(
        html`<meal-overview
          .meals=${mealState.meals}
          .portions=${3}
        ></meal-overview>`,
      );

      await (component as unknown as { updateComplete: Promise<boolean> })
        .updateComplete;

      const gramsChip = component.shadowRoot?.querySelector('.overview-grams');
      const gramsText = gramsChip?.textContent
        ?.toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
      expect(gramsText).to.include('30g');
    });
  });

  describe('getTodaysFoodGrams Function', () => {
    it('returns only meals scheduled for the specified day', () => {
      // Sunday (day 0) gets only the second meal (1g)
      const meals: FeedingTime[] = [
        daySpecificMeals.noDayMask, // No days mask = not counted
        daySpecificMeals.sundayOnly, // Sunday only
      ];

      const sundayTotal = getTodaysFoodGrams(meals, 0);
      expect(sundayTotal).to.equal(1);
    });

    it('calculates total grams for each day of the week correctly', () => {
      const meals: FeedingTime[] = [
        daySpecificMeals.weekdaysOnly, // Mon-Fri (2g each)
        daySpecificMeals.weekendsOnly, // Sun+Sat (1g each)
      ];

      expect(getTodaysFoodGrams(meals, 0)).to.equal(1); // Sunday: only second meal
      expect(getTodaysFoodGrams(meals, 1)).to.equal(2); // Monday: only first meal
      expect(getTodaysFoodGrams(meals, 5)).to.equal(2); // Friday: only first meal
      expect(getTodaysFoodGrams(meals, 6)).to.equal(1); // Saturday: only second meal
    });
  });

  describe('getWeeklyAveragePortion Function', () => {
    it('calculates weekly average and handles edge cases', () => {
      // Empty meals
      expect(getWeeklyAveragePortion([])).to.equal(0);

      // Meals without portion field
      const mealsWithoutPortion: FeedingTime[] = [
        {
          hour: 8,
          minute: 0,
          days: 0b0000001,
          enabled: 1,
        } as unknown as FeedingTime,
      ];
      expect(getWeeklyAveragePortion(mealsWithoutPortion)).to.equal(0);

      // All days (2g × 7 days = 14g total ÷ 7 = 2g average)
      expect(getWeeklyAveragePortion([daySpecificMeals.allDays])).to.equal(2);

      // Partial week: (2g × 5 days) + (1g × 2 days) = 12g ÷ 7 = 1.71g
      const partialWeek = [
        daySpecificMeals.weekdaysOnly,
        daySpecificMeals.weekendsOnly,
      ];
      expect(getWeeklyAveragePortion(partialWeek)).to.be.closeTo(
        (2 * 5 + 1 * 2) / 7,
        0.01,
      );
    });
  });
});

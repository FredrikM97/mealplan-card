import { expect } from '@open-wc/testing';
import '../../src/components/schedule-view';
import { ScheduleView } from '../../src/components/schedule-view';
import { describe, it, vi } from 'vitest';
import { SaveEvent } from '../../src/constants';
import { testMeals } from '../fixtures/data';
import type { FeedingTime } from '../../src/types';
import {
  createMealStateController,
  getTestProfile,
  createScheduleViewFixture,
} from '../fixtures/factories';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

describe('ScheduleView Component', () => {
  const profile = getTestProfile();

  it('builds columns based on profile fields', async () => {
    const controller = createMealStateController();
    const meals = [testMeals.breakfast];
    const el = (await createScheduleViewFixture(controller, {
      profile,
      meals,
    })) as ScheduleView;

    // Test that component renders with meal data
    expect(el).to.exist;
    expect(el.getMeals().length).to.equal(0); // Not synced yet
  });

  it('syncs draft meals from state', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;
    controller.meals = [testMeals.breakfast, testMeals.dinner];
    await el.updateComplete;
    expect(el.getMeals().length).to.equal(2);
    expect(el.getMeals()[0].hour).to.equal(8);
    expect(el.getMeals()[1].hour).to.equal(18);
  });

  it('handles open edit', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;
    controller.meals = [testMeals.breakfast, testMeals.dinner];
    const meal = {
      ...el.getMeals()[0],
      _idx: 0,
    };
    el.handleMealAction('edit', meal._idx ?? 0, meal);
    expect(el.getEditMeals()).to.exist;
    expect(el.getEditMeals()?.index).to.equal(0);
    expect(el.getEditMeals()?.meal.hour).to.equal(8);
  });

  it('handles open add', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;
    el.handleOpenAdd();
    expect(el.getEditMeals()).to.exist;
    expect(el.getEditMeals()?.index).to.be.undefined;
    expect(el.getEditMeals()?.meal.hour).to.equal(12);
    expect(el.getEditMeals()?.meal.portion).to.equal(1);
  });

  it('handles delete', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;
    controller.meals = [testMeals.breakfast, testMeals.dinner];

    const mealToDelete = el.getMeals()[0] as FeedingTime & { _idx?: number };
    el.handleMealAction('delete', mealToDelete._idx ?? 0, mealToDelete);
    expect(el.getMeals().length).to.equal(1);
    expect(el.getMeals()[0].hour).to.equal(18);
  });

  it('handles cancel', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await el.handleCancel();
    expect(eventFired).to.be.true;
  });

  it('handles save', async () => {
    const hass = {
      states: {},
      callService: vi.fn(),
      language: 'en',
    };
    const controller = createMealStateController();
    controller.hass = hass;

    const el = (await createScheduleViewFixture(controller, {
      hass,
    })) as ScheduleView;

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await el.handleSave();
    expect(eventFired).to.be.true;
    expect(hass.callService.mock.calls.length).to.be.greaterThan(0);
  });

  it('handles edit save for new meal', async () => {
    const controller = createMealStateController();
    const el = (await createScheduleViewFixture(controller)) as ScheduleView;

    const customEvent = new SaveEvent({
      meal: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
      index: undefined,
    });

    el.handleEditSave(customEvent);
    expect(el.getMeals().length).to.equal(1);
    expect(el.getMeals()[0].hour).to.equal(12);
  });

  it('handles edit save for existing meal', async () => {
    const controller = createMealStateController();
    const el = await createScheduleViewFixture(controller);
    controller.meals = [testMeals.breakfast];

    const customEvent = new SaveEvent({
      meal: { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
      index: 0,
    });

    el.handleEditSave(customEvent);

    expect(el.getMeals().length).to.equal(1);
    expect(el.getMeals()[0].hour).to.equal(18);
  });
});

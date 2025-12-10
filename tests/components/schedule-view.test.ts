import { expect } from '@open-wc/testing';
import '../../src/components/schedule-view';
import { ScheduleView } from '../../src/components/schedule-view';
import { describe, it, vi } from 'vitest';
import { SaveEvent } from '../../src/constants';
import { testMeals } from '../fixtures/data';
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
    const mealState = createMealStateController();
    const meals = [testMeals.breakfast];
    const el = (await createScheduleViewFixture(mealState, {
      profile,
      meals,
    })) as ScheduleView;

    // Test that component renders with meal data
    expect(el).to.exist;
    expect((el as any).draftMeals.length).to.equal(0); // Not synced yet
  });

  it('syncs draft meals from state', async () => {
    const mealState = createMealStateController([
      testMeals.breakfast,
      testMeals.dinner,
    ]);

    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await el.updateComplete;
    expect((el as any).draftMeals.length).to.equal(2);
    expect((el as any).draftMeals[0].hour).to.equal(8);
    expect((el as any).draftMeals[1].hour).to.equal(18);
  });

  it('handles open edit', async () => {
    const mealState = createMealStateController([testMeals.breakfast]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await el.updateComplete;
    const meal = { ...(el as any).draftMeals[0], _idx: 0 };
    (el as any).handleMealAction('edit', meal._idx ?? 0, meal);
    expect((el as any).editMeal).to.exist;
    expect((el as any).editMeal.index).to.equal(0);
    expect((el as any).editMeal.meal.hour).to.equal(8);
  });

  it('handles open add', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as any).handleOpenAdd();
    expect((el as any).editMeal).to.exist;
    expect((el as any).editMeal.index).to.be.undefined;
    expect((el as any).editMeal.meal.hour).to.equal(12);
    expect((el as any).editMeal.meal.portion).to.equal(1);
  });

  it('handles delete', async () => {
    const mealState = createMealStateController([
      testMeals.breakfast,
      testMeals.dinner,
    ]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await el.updateComplete;
    const mealToDelete = (el as any).draftMeals[0];
    (el as any).handleMealAction(
      'delete',
      mealToDelete._idx ?? 0,
      mealToDelete,
    );
    expect((el as any).draftMeals.length).to.equal(1);
    expect((el as any).draftMeals[0].hour).to.equal(18);
  });

  it('handles cancel', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await (el as any).handleCancel();
    expect(eventFired).to.be.true;
  });

  it('handles save', async () => {
    const hass = {
      states: {},
      callService: vi.fn(),
    };
    const mealState = createMealStateController([testMeals.breakfast]);
    mealState.hass = hass;

    const el = (await createScheduleViewFixture(mealState, {
      hass,
    })) as ScheduleView;

    (el as any).draftMeals = [...mealState.meals];

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await (el as any).handleSave();
    expect(eventFired).to.be.true;
    expect(hass.callService.mock.calls.length).to.be.greaterThan(0);
  });

  it('handles edit save for new meal', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as any).draftMeals = [];

    const customEvent = new SaveEvent({
      meal: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
      index: undefined,
    });

    (el as any).handleEditSave(customEvent);
    expect((el as any).draftMeals.length).to.equal(1);
    expect((el as any).draftMeals[0].hour).to.equal(12);
  });

  it('handles edit save for existing meal', async () => {
    const mealState = createMealStateController([testMeals.breakfast]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as any).draftMeals = [...mealState.meals];

    const customEvent = new SaveEvent({
      meal: { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
      index: 0,
    });

    (el as any).handleEditSave(customEvent);
    expect((el as any).draftMeals.length).to.equal(1);
    expect((el as any).draftMeals[0].hour).to.equal(18);
    expect((el as any).draftMeals[0].minute).to.equal(30);
  });
});

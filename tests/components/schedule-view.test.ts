import { expect } from '@open-wc/testing';
import '../../src/components/schedule-view';
import { ScheduleView } from '../../src/components/schedule-view';
import { describe, it, vi } from 'vitest';
import { SaveEvent } from '../../src/constants';
import { testMeals } from '../fixtures/data';
import type { FeedingTime, EditMealState } from '../../src/types';
import {
  createMealStateController,
  getTestProfile,
  createScheduleViewFixture,
} from '../fixtures/factories';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

type ScheduleViewTestable = {
  draftMeals: FeedingTime[];
  editMeal?: EditMealState;
  handleMealAction: (action: string, index: number, meal: FeedingTime) => void;
  handleOpenAdd: () => void;
  handleCancel: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleEditSave: (event: CustomEvent) => void;
  updateComplete: Promise<boolean>;
  addEventListener: (type: string, listener: EventListener) => void;
};

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
    expect((el as unknown as ScheduleViewTestable).draftMeals.length).to.equal(
      0,
    ); // Not synced yet
  });

  it('syncs draft meals from state', async () => {
    const mealState = createMealStateController([
      testMeals.breakfast,
      testMeals.dinner,
    ]);

    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await (el as unknown as ScheduleViewTestable).updateComplete;
    expect((el as unknown as ScheduleViewTestable).draftMeals.length).to.equal(
      2,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals[0].hour).to.equal(
      8,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals[1].hour).to.equal(
      18,
    );
  });

  it('handles open edit', async () => {
    const mealState = createMealStateController([testMeals.breakfast]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await (el as unknown as ScheduleViewTestable).updateComplete;
    const meal = {
      ...(el as unknown as ScheduleViewTestable).draftMeals[0],
      _idx: 0,
    };
    (el as unknown as ScheduleViewTestable).handleMealAction(
      'edit',
      meal._idx ?? 0,
      meal,
    );
    expect((el as unknown as ScheduleViewTestable).editMeal).to.exist;
    expect((el as unknown as ScheduleViewTestable).editMeal?.index).to.equal(0);
    expect(
      (el as unknown as ScheduleViewTestable).editMeal?.meal.hour,
    ).to.equal(8);
  });

  it('handles open add', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as unknown as ScheduleViewTestable).handleOpenAdd();
    expect((el as unknown as ScheduleViewTestable).editMeal).to.exist;
    expect((el as unknown as ScheduleViewTestable).editMeal?.index).to.be
      .undefined;
    expect(
      (el as unknown as ScheduleViewTestable).editMeal?.meal.hour,
    ).to.equal(12);
    expect(
      (el as unknown as ScheduleViewTestable).editMeal?.meal.portions?.[0],
    ).to.equal(1);
  });

  it('handles delete', async () => {
    const mealState = createMealStateController([
      testMeals.breakfast,
      testMeals.dinner,
    ]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    await (el as unknown as ScheduleViewTestable).updateComplete;
    const mealToDelete = (el as unknown as ScheduleViewTestable)
      .draftMeals[0] as FeedingTime & { _idx?: number };
    (el as unknown as ScheduleViewTestable).handleMealAction(
      'delete',
      mealToDelete._idx ?? 0,
      mealToDelete,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals.length).to.equal(
      1,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals[0].hour).to.equal(
      18,
    );
  });

  it('handles cancel', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    let eventFired = false;
    (el as unknown as ScheduleViewTestable).addEventListener(
      'schedule-closed',
      () => {
        eventFired = true;
      },
    );

    await (el as unknown as ScheduleViewTestable).handleCancel();
    expect(eventFired).to.be.true;
  });

  it('handles save', async () => {
    const hass = {
      states: {},
      callService: vi.fn(),
      language: 'en',
    };
    const mealState = createMealStateController([testMeals.breakfast]);
    mealState.hass = hass;

    const el = (await createScheduleViewFixture(mealState, {
      hass,
    })) as ScheduleView;

    (el as unknown as ScheduleViewTestable).draftMeals = [...mealState.meals];

    let eventFired = false;
    (el as unknown as ScheduleViewTestable).addEventListener(
      'schedule-closed',
      () => {
        eventFired = true;
      },
    );

    await (el as unknown as ScheduleViewTestable).handleSave();
    expect(eventFired).to.be.true;
    expect(hass.callService.mock.calls.length).to.be.greaterThan(0);
  });

  it('handles edit save for new meal', async () => {
    const mealState = createMealStateController();
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as unknown as ScheduleViewTestable).draftMeals = [];

    const customEvent = new SaveEvent({
      meal: { hour: 12, minute: 0, portions: [5], days: 127, enabled: 1 },
      index: undefined,
    });

    (el as unknown as ScheduleViewTestable).handleEditSave(customEvent);
    expect((el as unknown as ScheduleViewTestable).draftMeals.length).to.equal(
      1,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals[0].hour).to.equal(
      12,
    );
  });

  it('handles edit save for existing meal', async () => {
    const mealState = createMealStateController([testMeals.breakfast]);
    const el = (await createScheduleViewFixture(mealState)) as ScheduleView;

    (el as unknown as ScheduleViewTestable).draftMeals = [...mealState.meals];

    const customEvent = new SaveEvent({
      meal: { hour: 18, minute: 30, portions: [5], days: 127, enabled: 1 },
      index: 0,
    });

    (el as unknown as ScheduleViewTestable).handleEditSave(customEvent);
    expect((el as unknown as ScheduleViewTestable).draftMeals.length).to.equal(
      1,
    );
    expect((el as unknown as ScheduleViewTestable).draftMeals[0].hour).to.equal(
      18,
    );
    expect(
      (el as unknown as ScheduleViewTestable).draftMeals[0].minute,
    ).to.equal(30);
  });
});

import { fixture, html, expect } from '@open-wc/testing';
import '../../src/components/schedule-view';
import { ScheduleView } from '../../src/components/schedule-view';
import { describe, it, vi, beforeEach } from 'vitest';
import { profiles } from '../../src/profiles/profiles';
import { MealStateController } from '../../src/mealStateController';
import type { ReactiveControllerHost } from 'lit';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

describe('ScheduleView Component', () => {
  let mockHost: ReactiveControllerHost;
  let mealState: MealStateController;
  const profile = profiles[0];

  beforeEach(() => {
    mockHost = {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
      updateComplete: Promise.resolve(true),
    };
    mealState = new MealStateController(mockHost, 'sensor.test', profile);
  });

  it('builds columns based on profile fields', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    const columns = (el as any).buildColumns();
    expect(columns).to.have.property('time');
    expect(columns).to.have.property('actions');
  });

  it('builds rows with index', async () => {
    const meals = [
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
      { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
    ];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    const rows = (el as any).buildRows();
    expect(rows.length).to.equal(2);
    expect(rows[0]._idx).to.equal(0);
    expect(rows[1]._idx).to.equal(1);
    expect(rows[0].hourMinute).to.equal(480); // 8 * 60 + 0
    expect(rows[1].hourMinute).to.equal(1110); // 18 * 60 + 30
  });

  it('handles open edit', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    (el as any).handleOpenEdit(0);
    expect((el as any).editState).to.exist;
    expect((el as any).editState.index).to.equal(0);
    expect((el as any).editState.meal.hour).to.equal(8);
  });

  it('handles open add', async () => {
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${[]}
      ></schedule-view>`,
    );

    (el as any).handleOpenAdd();
    expect((el as any).editState).to.exist;
    expect((el as any).editState.index).to.be.undefined;
    expect((el as any).editState.meal.hour).to.equal(12);
    expect((el as any).editState.meal.portion).to.equal(1);
  });

  it('handles delete', async () => {
    const meals = [
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
      { hour: 18, minute: 0, portion: 10, days: 127, enabled: 1 },
    ];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    (el as any).handleDelete(0);
    expect(mealState.getMeals().length).to.equal(1);
    expect(mealState.getMeals()[0].hour).to.equal(18);
  });

  it('handles cancel', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

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
    mealState.setHass(hass);
    mealState.setMeals([
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
    ]);

    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${mealState.getMeals()}
        .hass=${hass}
      ></schedule-view>`,
    );

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await (el as any).handleSave();
    expect(eventFired).to.be.true;
    expect(hass.callService.mock.calls.length).to.be.greaterThan(0);
  });

  it('handles toggle enabled', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    const event = {
      target: { checked: false },
    } as any;

    (el as any).handleToggleEnabled(0, event);
    expect(mealState.getMeals()[0].enabled).to.equal(0);
  });

  it('handles edit save for new meal', async () => {
    const meals: any[] = [];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    (el as any).editState = {
      index: undefined,
      meal: {},
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.getMeals().length).to.equal(1);
    expect(mealState.getMeals()[0].hour).to.equal(12);
  });

  it('handles edit save for existing meal', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${meals}
      ></schedule-view>`,
    );

    (el as any).editState = {
      index: 0,
      meal: meals[0],
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.getMeals().length).to.equal(1);
    expect(mealState.getMeals()[0].hour).to.equal(18);
    expect(mealState.getMeals()[0].minute).to.equal(30);
  });

  it('handles edit save with validation error', async () => {
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${[]}
      ></schedule-view>`,
    );

    (el as any).editState = {
      index: undefined,
      meal: {},
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 25, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect((el as any).editState.error).to.not.be.null;
    expect(mealState.getMeals().length).to.equal(0);
  });

  it('returns empty object when profile is null', async () => {
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .meals=${[]}
      ></schedule-view>`,
    );

    const columns = (el as any).buildColumns();
    expect(columns).to.deep.equal({});
  });

  it('does not handle edit save when editState is null', async () => {
    const el = await fixture<ScheduleView>(
      html`<schedule-view
        .mealState=${mealState}
        .profile=${profile}
        .meals=${[]}
      ></schedule-view>`,
    );

    const customEvent = new CustomEvent('save', {
      detail: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.getMeals().length).to.equal(0);
  });
});

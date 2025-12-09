import { fixture, html, expect } from '@open-wc/testing';
import '../../src/components/overview';
import { describe, it, beforeEach, vi } from 'vitest';
import { profiles } from '../../src/profiles/profiles';
import { MealStateController } from '../../src/mealStateController';
import type { ReactiveControllerHost } from 'lit';

describe('MealPlanCard Overview Component', () => {
  let mockHost: ReactiveControllerHost & EventTarget;
  let mealState: MealStateController;
  const profile = profiles[0];

  beforeEach(() => {
    const eventTarget = new EventTarget();
    mockHost = Object.assign(eventTarget, {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
      updateComplete: Promise.resolve(true),
    });
  });

  it('renders overview with meal state data', async () => {
    const mockHass = {
      states: {},
      callService: vi.fn(),
    };
    mealState = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      mockHass,
    );

    mealState.setMeals([
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
    ]);

    const el = await fixture<any>(
      html`<meal-overview .mealState=${mealState}></meal-overview>`,
    );

    await el.updateComplete;
    expect(el).to.exist;
    expect(el.shadowRoot?.querySelector('.overview-grams')).to.exist;
  });

  it('multiplies metrics by portions config', async () => {
    const mockHass = {
      states: {},
      callService: vi.fn(),
    };
    mealState = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      mockHass,
    );

    mealState.setMeals([
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
    ]);

    const el = await fixture<any>(
      html`<meal-overview
        .mealState=${mealState}
        .portions=${3}
      ></meal-overview>`,
    );

    await el.updateComplete;

    const grams = el.shadowRoot?.querySelector('.overview-grams');
    expect(grams).to.exist;
    const gramsText = grams.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(gramsText).to.include('30g');
  });

  it('renders without portions multiplier', async () => {
    const mockHass = {
      states: {},
      callService: vi.fn(),
    };
    mealState = new MealStateController(
      mockHost,
      'sensor.test',
      profile,
      mockHass,
    );

    mealState.setMeals([
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
    ]);

    const el = await fixture<any>(
      html`<meal-overview
        .mealState=${mealState}
        .portions=${1}
      ></meal-overview>`,
    );

    await el.updateComplete;
    expect(el).to.exist;

    const grams = el.shadowRoot?.querySelector('.overview-grams');
    expect(grams).to.exist;
    const gramsText = grams.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(gramsText).to.include('10g');
  });
});

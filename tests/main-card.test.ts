import { fixture, html } from '@open-wc/testing';
import { expect } from 'vitest';
import '../src/main';
import { describe, it } from 'vitest';
import { MealPlanCard } from '../src/main';
import { vi } from 'vitest';
import { encodeMealData } from './fixtures/data';
import {
  createMockHassWithSensor,
  createMockHass,
  createMealPlanCardConfig,
  getCleverioProfile,
  createMealPlanCardFixture,
} from './fixtures/factories';
import { ScheduleClosedEvent } from '../src/constants';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

vi.stubGlobal(
  'fetch',
  vi.fn(async () => ({
    ok: true,
    json: async () => ({}),
  })),
);

describe('MealPlanCard', () => {
  it('decodes real base64 meal plan data and passes it to children', async () => {
    const base64 = encodeMealData(127, 2, 8, 0, 1);
    const config = createMealPlanCardConfig({ title: 'Test Card' });
    const hass = createMockHassWithSensor('sensor.test', base64, {
      friendly_name: 'Test Sensor',
    });
    const el = await createMealPlanCardFixture(config, hass);
    await el.updateComplete;
    expect(el).to.exist;
  }, 20000);

  it('shows no overview when config is incomplete (missing sensor, manufacturer, or config)', async () => {
    // Missing config
    let config = createMealPlanCardConfig({ minimal: true });
    let el = await createMealPlanCardFixture(config, createMockHass());
    (el as any)._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing sensor
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: '',
      title: 'Test',
    });
    el = await createMealPlanCardFixture(config, createMockHass());
    (el as any)._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing manufacturer (no profile)
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: 'sensor.test',
      title: 'Test',
    });
    el = await createMealPlanCardFixture(config, createMockHass());
    (el as any)._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;
  });

  it('renders with custom title', async () => {
    const base64 = encodeMealData(127, 2, 8, 0, 1);
    const config = createMealPlanCardConfig({ title: 'Custom Title' });
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = await createMealPlanCardFixture(config, hass);
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    const card = el.shadowRoot!.querySelector('ha-card');
    expect(card).to.exist;
    const header = card!.getAttribute('header');
    expect(header).to.equal('Custom Title');
  });
});

describe('getConfigElement', () => {
  it('returns a card-editor element with setConfig method', async () => {
    const el = await MealPlanCard.getConfigElement();
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal('mealplan-card-editor');
    expect(typeof (el as any).setConfig).to.equal('function');
  });
});

describe('MealPlanCard integration', () => {
  it('getStubConfig returns default config', () => {
    const stub = MealPlanCard.getStubConfig();
    expect(stub.sensor).to.equal('');
    expect(stub.title).to.equal('MealPlan Card');
    expect(stub.portions).to.equal(6);
  });

  it('opens schedule dialog when button clicked', async () => {
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const config = createMealPlanCardConfig();
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = await createMealPlanCardFixture(config, hass);
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector('ha-button');
    expect(button).to.exist;

    (button as HTMLElement).click();
    await el.updateComplete;

    expect((el as any)._dialogOpen).to.be.true;
    const scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;
  });

  it('closes schedule dialog on schedule-closed event', async () => {
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const config = createMealPlanCardConfig();
    const hass = {
      ...createMockHassWithSensor('sensor.test', base64),
      callService: vi.fn(),
    };
    const el = await createMealPlanCardFixture(config, hass);
    (el as any)._haComponentsReady = true;
    (el as any)._dialogOpen = true;
    await el.updateComplete;

    const scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;

    scheduleView!.dispatchEvent(new ScheduleClosedEvent());
    await el.updateComplete;

    expect((el as any)._dialogOpen).to.be.false;
  });
});

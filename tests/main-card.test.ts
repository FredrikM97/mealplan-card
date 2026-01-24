import { expect } from 'vitest';
import '../src/main';
import { describe, it } from 'vitest';
import { MealPlanCard } from '../src/main';
import { vi } from 'vitest';
import {
  createMockHassWithSensor,
  createMockHass,
  createMealPlanCardConfig,
  createMealPlanCardFixture,
  encodeMealData,
} from './fixtures/factories';
import { ScheduleClosedEvent } from '../src/constants';
import { testMeals } from './fixtures/data';

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
    const base64 = encodeMealData(testMeals.breakfast);
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
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing sensor
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: '',
      title: 'Test',
    });
    el = await createMealPlanCardFixture(config, createMockHass());

    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing manufacturer (no profile)
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: 'sensor.test',
      title: 'Test',
    });
    el = await createMealPlanCardFixture(config, createMockHass());

    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;
  });

  it('renders with custom title', async () => {
    const base64 = encodeMealData(testMeals.breakfast);
    const config = createMealPlanCardConfig({ title: 'Custom Title' });
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = await createMealPlanCardFixture(config, hass);
    (el as unknown as { _haComponentsReady: boolean })._haComponentsReady =
      true;
    await el.updateComplete;

    const card = el.shadowRoot!.querySelector('ha-card');
    expect(card).to.exist;
    const header = card!.getAttribute('header');
    expect(header).to.equal('Custom Title');
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
    const base64 = encodeMealData(testMeals.breakfast);
    const config = createMealPlanCardConfig();
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = await createMealPlanCardFixture(config, hass);

    await el.updateComplete;

    const button = el.shadowRoot!.querySelector('ha-button');
    expect(button).to.exist;

    (button as HTMLElement).click();
    await el.updateComplete;

    const scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;
  });

  it('closes schedule dialog on schedule-closed event', async () => {
    const base64 = encodeMealData(testMeals.breakfast);
    const config = createMealPlanCardConfig();
    const hass = {
      ...createMockHassWithSensor('sensor.test', base64),
      callService: vi.fn(),
    };
    const el = await createMealPlanCardFixture(config, hass);

    await el.updateComplete;

    // Open dialog
    const button = el.shadowRoot!.querySelector('ha-button');
    expect(button).to.exist;
    (button as HTMLElement).click();
    await el.updateComplete;

    // Verify dialog is open
    let scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;

    // Close dialog
    scheduleView!.dispatchEvent(new ScheduleClosedEvent());
    await el.updateComplete;

    // Verify dialog is closed
    scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.not.exist;
  });
  it('updates meal state when hass changes', async () => {
    const base64_1 = encodeMealData(testMeals.breakfast);
    const base64_2 = encodeMealData(testMeals.lunch);

    const config = createMealPlanCardConfig();
    const hass = createMockHassWithSensor('sensor.test', base64_1);
    const card = await createMealPlanCardFixture(config, hass);

    await card.updateComplete;

    expect(card.mealState?.meals).to.have.lengthOf(1);
    expect(card.mealState?.meals[0].hour).to.equal(8);

    card.hass = createMockHassWithSensor('sensor.test', base64_2);
    await card.updateComplete;

    expect(card.mealState?.meals).to.have.lengthOf(1);
    expect(card.mealState?.meals[0].hour).to.equal(12);
  });

  it('returns grid options', () => {
    const gridOptions = MealPlanCard.getGridOptions();
    expect(gridOptions.columns).to.equal(6);
    expect(gridOptions.rows).to.equal(4);
    expect(gridOptions.min_columns).to.equal(6);
    expect(gridOptions.min_rows).to.equal(4);
  });

  it('getConfigForm returns schema', () => {
    const schema = MealPlanCard.getConfigForm();
    expect(schema).to.exist;
    expect(schema.schema).to.be.an('array');
  });
});

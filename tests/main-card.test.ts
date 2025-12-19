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
  createMealPlanCardFixture,
} from './fixtures/factories';
import { ScheduleClosedEvent } from '../src/constants';

type MealPlanCardElement = HTMLElement & {
  updateComplete: Promise<boolean>;
  _haComponentsReady?: boolean;
  _dialogOpen?: boolean;
  mealState?: unknown;
  hass?: unknown;
};

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
    const el = (await createMealPlanCardFixture(
      config,
      hass,
    )) as MealPlanCardElement;
    await el.updateComplete;
    expect(el).to.exist;
  }, 20000);

  it('initializes mealState in setConfig when hass is available', () => {
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = document.createElement('mealplan-card') as MealPlanCard;
    el.hass = hass;

    const config = createMealPlanCardConfig();
    el.setConfig(config);

    expect((el as unknown as { mealState: unknown }).mealState).to.exist;
  });

  it('shows no overview when config is incomplete (missing sensor, manufacturer, or config)', async () => {
    // Missing config
    let config = createMealPlanCardConfig({ minimal: true });
    let el = (await createMealPlanCardFixture(
      config,
      createMockHass(),
    )) as MealPlanCardElement;
    el._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing sensor
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: '',
      title: 'Test',
    });
    el = (await createMealPlanCardFixture(
      config,
      createMockHass(),
    )) as MealPlanCardElement;
    el._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;

    // Missing manufacturer (no profile)
    config = createMealPlanCardConfig({
      minimal: true,
      sensor: 'sensor.test',
      title: 'Test',
    });
    el = (await createMealPlanCardFixture(
      config,
      createMockHass(),
    )) as MealPlanCardElement;
    el._haComponentsReady = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('meal-overview')).to.not.exist;
  });

  it('renders with custom title', async () => {
    const base64 = encodeMealData(127, 2, 8, 0, 1);
    const config = createMealPlanCardConfig({ title: 'Custom Title' });
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = (await createMealPlanCardFixture(
      config,
      hass,
    )) as MealPlanCardElement;
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
    const base64 = encodeMealData(127, 8, 0, 10, 1);
    const config = createMealPlanCardConfig();
    const hass = createMockHassWithSensor('sensor.test', base64);
    const el = (await createMealPlanCardFixture(
      config,
      hass,
    )) as MealPlanCardElement;
    el._haComponentsReady = true;
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector('ha-button');
    expect(button).to.exist;

    (button as HTMLElement).click();
    await el.updateComplete;

    expect(el._dialogOpen).to.be.true;
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
    const el = (await createMealPlanCardFixture(
      config,
      hass,
    )) as MealPlanCardElement;
    el._haComponentsReady = true;
    el._dialogOpen = true;
    await el.updateComplete;

    const scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;

    scheduleView!.dispatchEvent(new ScheduleClosedEvent());
    await el.updateComplete;

    expect(el._dialogOpen).to.be.false;
  });

  it('updates meal state when hass changes', async () => {
    const base64_1 = encodeMealData(127, 8, 0, 10, 1);
    const base64_2 = encodeMealData(63, 9, 30, 5, 1);
    const config = createMealPlanCardConfig();
    const hass = createMockHassWithSensor('sensor.test', base64_1);
    const el = (await createMealPlanCardFixture(
      config,
      hass,
    )) as MealPlanCardElement & { mealState: { meals: unknown[] } };
    await el.updateComplete;

    expect(el.mealState.meals).to.have.lengthOf(1);

    // Update hass with new sensor value
    el.hass = createMockHassWithSensor('sensor.test', base64_2);
    await el.updateComplete;

    expect(el.mealState.meals).to.have.lengthOf(1);
    expect((el.mealState.meals[0] as { hour: number }).hour).to.equal(9);
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

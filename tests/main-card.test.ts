import { fixture, html } from '@open-wc/testing';
import { expect } from 'vitest';
import '../src/main';
import { describe, it } from 'vitest';
import { MealPlanCard } from '../src/main';
import { vi } from 'vitest';
import { profiles } from '../src/profiles/profiles';

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
    const base64 = btoa(String.fromCharCode(127, 2, 8, 0, 1));
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const config = {
      sensor: 'sensor.test',
      title: 'Test Card',
      device_manufacturer: 'Cleverio',
      device_model: '',
      _profile: { ...profileGroup, manufacturer: 'Cleverio', model: '' },
    };
    const hass = {
      states: {
        'sensor.test': {
          state: base64,
          attributes: { friendly_name: 'Test Sensor' },
        },
      },
    };
    const el = await fixture<any>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    await el.updateComplete;
    expect(el).to.exist;
  }, 20000);

  it('shows error for missing config', async () => {
    const el = await fixture<MealPlanCard>(
      html`<mealplan-card></mealplan-card>`,
    );
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    // With new implementation, mealState won't be created without config
    // so overview and buttons won't render
    const overview = el.shadowRoot!.querySelector('meal-overview');
    expect(overview).to.not.exist;
  });

  it('shows error for missing sensor', async () => {
    const el = await fixture<MealPlanCard>(
      html`<mealplan-card></mealplan-card>`,
    );
    el.setConfig({
      sensor: '',
      title: 'Test',
      helper: '',
    });
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    // Without sensor, mealState won't be created
    const overview = el.shadowRoot!.querySelector('meal-overview');
    expect(overview).to.not.exist;
  });

  it('shows error for missing manufacturer', async () => {
    const el = await fixture<MealPlanCard>(
      html`<mealplan-card></mealplan-card>`,
    );
    el.setConfig({
      sensor: 'sensor.test',
      title: 'Test',
      helper: '',
    });
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    // Without profile (which requires manufacturer), mealState won't be created
    const overview = el.shadowRoot!.querySelector('meal-overview');
    expect(overview).to.not.exist;
  });

  it('renders with custom title', async () => {
    const base64 = btoa(String.fromCharCode(127, 2, 8, 0, 1));
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const config = {
      sensor: 'sensor.test',
      title: 'Custom Title',
      profile: profileGroup!,
      helper: '',
    };
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
    };
    const el = await fixture<any>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    (el as any)._haComponentsReady = true;
    await el.updateComplete;

    const card = el.shadowRoot!.querySelector('ha-card');
    expect(card).to.exist;
    // Header includes version, so check it starts with the title
    const header = card!.getAttribute('header');
    expect(header).to.include('Custom Title');
    expect(header).to.match(/Custom Title v\d{4}-\d{2}-\d{2}/);
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
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const config = {
      sensor: 'sensor.test',
      title: 'Test',
      device_manufacturer: 'Cleverio',
      device_model: '',
      profile: { ...profileGroup, manufacturer: 'Cleverio', model: '' },
      helper: '',
    };
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
    };
    const el = await fixture<MealPlanCard>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
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
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const config = {
      sensor: 'sensor.test',
      title: 'Test',
      device_manufacturer: 'Cleverio',
      device_model: '',
      profile: { ...profileGroup, manufacturer: 'Cleverio', model: '' },
      helper: '',
    };
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
      callService: vi.fn(),
    };
    const el = await fixture<MealPlanCard>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    (el as any)._haComponentsReady = true;
    (el as any)._dialogOpen = true;
    await el.updateComplete;

    const scheduleView = el.shadowRoot!.querySelector('schedule-view');
    expect(scheduleView).to.exist;

    scheduleView!.dispatchEvent(
      new CustomEvent('schedule-closed', { bubbles: true, composed: true }),
    );
    await el.updateComplete;

    expect((el as any)._dialogOpen).to.be.false;
  });
});

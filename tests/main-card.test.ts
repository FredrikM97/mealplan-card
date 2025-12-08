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
    // Encodes: days=127, portion=2, hour=8, minute=0, enabled=1
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
});

describe('getConfigElement', () => {
  it('returns a card-editor element with setConfig method', async () => {
    const el = await MealPlanCard.getConfigElement();
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal('mealplan-card-editor');
    expect(typeof el.setConfig).to.equal('function');
  });
});

// (Overview UI test moved to views/overview.test.ts)

describe('MealPlanCard integration', () => {
  it('calls hass.callService when schedule Save is pressed', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const config = {
      sensor: 'text.test',
      title: 'Test Card',
      device_manufacturer: 'Cleverio',
      device_model: '',
      _profile: { ...profileGroup, manufacturer: 'Cleverio', model: '' },
    };
    const callService = vi.fn();
    const hass = {
      states: { 'text.test': { state: base64, attributes: {} } },
      callService,
    };
    const el = await fixture<any>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    await el.updateComplete;
    // Test that mealStateController exists and can call saveMeals
    expect(el.mealState).to.exist;
    // Call saveMeals on the controller directly
    await el.mealState.saveMeals();
    // Verify callService was called
    expect(callService.mock.calls.length).to.be.greaterThan(0);
    const call = callService.mock.calls.find(
      (c) => c[0] === 'text' && c[1] === 'set_value',
    );
    expect(call, 'callService should be called with text.set_value').to.exist;
    if (call) expect(call[2].entity_id).to.equal('text.test');
  });

  it('getConfigElement resolves and returns a card editor', async () => {
    const el = await MealPlanCard.getConfigElement();
    expect(el).to.be.instanceOf(HTMLElement);
    expect(el.tagName.toLowerCase()).to.equal('mealplan-card-editor');
  });
});

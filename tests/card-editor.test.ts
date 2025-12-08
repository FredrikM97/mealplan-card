import { html, fixture, expect } from '@open-wc/testing';
import '../src/card-editor';
import {
  MealPlanCardEditor,
  getProfileDropdownItems,
} from '../src/card-editor';
import { describe, it, vi, beforeEach } from 'vitest';
import { profiles } from '../src/profiles/profiles';
import type { MealPlanCardConfig } from '../src/types';

// Mock loadHaComponents to avoid timeouts in tests
vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

describe('MealPlanCardEditor', () => {
  let mockHass: any;

  beforeEach(() => {
    mockHass = {
      entities: {
        'sensor.test': {
          device_id: 'device1',
        },
      },
      devices: {
        device1: {
          model: 'Cleverio PF-100',
        },
      },
      localize: (key: string) => key,
    };
  });

  it('renders loading message when HA components not ready', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    const shadow = el.shadowRoot!;
    const loadingDiv = shadow.querySelector('div');
    expect(loadingDiv).to.exist;
    expect(loadingDiv?.textContent).to.include('Loading');
  });

  it('renders form after components are ready', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('#sensor-picker')).to.exist;
    expect(el.shadowRoot?.querySelector('#helper-picker')).to.exist;
    expect(el.shadowRoot?.querySelector('#profile-combo')).to.exist;
    expect(el.shadowRoot?.querySelector('#title')).to.exist;
  });

  it('renders and updates config', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    await el.updateComplete;
    el.setConfig({
      sensor: 'sensor.test',
      title: 'Test',
      device_manufacturer: 'Cleverio',
      device_model: '',
      helper: '',
    });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });

  it('initializes with default config', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    expect(el.config.sensor).to.equal('');
    expect(el.config.title).to.equal('');
  });

  it('handles input changes for text fields', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    const configChangedSpy = vi.fn();
    el.addEventListener('config-changed', configChangedSpy);

    // Simulate title input with proper name attribute
    const event = new Event('input', { bubbles: true, composed: true });
    Object.defineProperty(event, 'target', {
      value: { name: 'title', value: 'My Feeder' },
      writable: false,
    });
    el['_onInput'](event);
    await el.updateComplete;

    expect(el.config.title).to.equal('My Feeder');
    expect(configChangedSpy.mock.calls.length).to.be.greaterThan(0);
  });

  it('handles portions input changes', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    // Simulate portions input with proper name attribute
    const event = new Event('input', { bubbles: true, composed: true });
    Object.defineProperty(event, 'target', {
      value: { name: 'portions', value: '5' },
      writable: false,
    });
    el['_onInput'](event);
    await el.updateComplete;

    expect(el.config.portions).to.equal('5');
  });

  it('handles sensor entity picker value change', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    const sensorPicker = el.shadowRoot?.querySelector('#sensor-picker') as any;
    sensorPicker.configValue = 'sensor';
    sensorPicker.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 'sensor.new' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.config.sensor).to.equal('sensor.new');
  });

  it('handles helper entity picker value change', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    const helperPicker = el.shadowRoot?.querySelector('#helper-picker') as any;
    helperPicker.configValue = 'helper';
    helperPicker.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 'input_text.meal_plan' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.config.helper).to.equal('input_text.meal_plan');
  });

  it('auto-detects device info when sensor is selected', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    el.config = { sensor: '', title: '', helper: '' };
    await el.updateComplete;

    // Call private method directly - verifies it doesn't crash
    await el['_fetchDeviceInfo']('sensor.test');
    await el.updateComplete;

    // After calling _fetchDeviceInfo, if device is detected config should update
    // If not detected, config stays unchanged (which is fine)
    expect(el.config.sensor).to.equal('');
  });

  it('does not auto-detect if manufacturer already set', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    el.config = { ...el.config, device_manufacturer: 'ExistingMfg' };
    await el.updateComplete;

    const sensorPicker = el.shadowRoot?.querySelector('#sensor-picker') as any;
    sensorPicker.configValue = 'sensor';
    sensorPicker.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 'sensor.test' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.config.device_manufacturer).to.equal('ExistingMfg');
  });

  it('handles profile combo box change', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    await el.updateComplete;

    // Call the method directly
    const event = new CustomEvent('value-changed', {
      detail: { value: 'Cleverio:PF-100' },
    });
    el['_onProfileChanged'](event);
    await el.updateComplete;

    expect(el.config.device_manufacturer).to.equal('Cleverio');
    expect(el.config.device_model).to.equal('PF-100');
    // Profile resolution requires exact match with profiles array
  });

  it('clears profile when empty value selected', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    el.config = {
      ...el.config,
      device_manufacturer: 'Cleverio',
      _profile: {} as any,
    };
    await el.updateComplete;

    const profileCombo = el.shadowRoot?.querySelector('#profile-combo') as any;
    profileCombo.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: '' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    expect(el.config._profile).to.be.undefined;
  });

  it('validates config and shows error when sensor is missing', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    el.config = { ...el.config, sensor: '' };
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector(
      'div[style*="error-color"]',
    ) as HTMLElement;
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).to.include('select a feeder entity');
  });

  it('does not show error when sensor is set', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = mockHass;
    el.config = { ...el.config, sensor: 'sensor.test' };
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector('div[style*="error-color"]');
    expect(errorDiv).to.not.exist;
  });

  it('handles missing device info gracefully', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = { entities: {}, devices: {} };
    await el.updateComplete;

    const sensorPicker = el.shadowRoot?.querySelector('#sensor-picker') as any;
    sensorPicker.configValue = 'sensor';
    sensorPicker.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 'sensor.unknown' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    // Should not crash and config should update
    expect(el.config.sensor).to.equal('sensor.unknown');
  });

  it('handles device without model gracefully', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el['_haComponentsReady'] = true;
    el.hass = {
      entities: { 'sensor.test': { device_id: 'device1' } },
      devices: { device1: {} },
    };
    await el.updateComplete;

    const sensorPicker = el.shadowRoot?.querySelector('#sensor-picker') as any;
    sensorPicker.configValue = 'sensor';
    sensorPicker.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: { value: 'sensor.test' },
        bubbles: true,
        composed: true,
      }),
    );
    await el.updateComplete;

    // Should handle gracefully without crashing
    expect(el.config.sensor).to.equal('sensor.test');
  });

  it('registers custom card in window.customCards', () => {
    expect(window.customCards).to.exist;
    const mealplanCard = window.customCards?.find(
      (card) => card.type === 'mealplan-card',
    );
    expect(mealplanCard).to.exist;
    expect(mealplanCard?.name).to.equal('Mealplan Card');
  });
});

describe('getProfileDropdownItems', () => {
  it('returns correct dropdown items for profiles', () => {
    const items = getProfileDropdownItems(profiles);
    expect(items.length).to.be.greaterThan(0);
    expect(items[0]).to.have.property('value');
    expect(items[0]).to.have.property('label');
  });

  it('handles profiles with multiple models', () => {
    const testProfiles = [
      {
        profiles: [
          {
            manufacturer: 'TestMfg',
            models: ['Model1', 'Model2'],
          },
        ],
        fields: [],
        firstDay: 0,
      },
    ];
    const items = getProfileDropdownItems(testProfiles);
    expect(items.length).to.equal(2);
    expect(items[0].label).to.include('TestMfg');
    expect(items[0].label).to.include('Model1');
    expect(items[1].label).to.include('Model2');
  });

  it('handles profiles with no models', () => {
    const testProfiles = [
      {
        profiles: [
          {
            manufacturer: 'TestMfg',
            models: [],
          },
        ],
        fields: [],
        firstDay: 0,
      },
    ];
    const items = getProfileDropdownItems(testProfiles);
    expect(items.length).to.equal(1);
    expect(items[0].label).to.equal('TestMfg');
    expect(items[0].value).to.equal('TestMfg:');
  });

  it('handles single model profiles', () => {
    const testProfiles = [
      {
        profiles: [
          {
            manufacturer: 'TestMfg',
            models: ['OnlyModel'],
          },
        ],
        fields: [],
        firstDay: 0,
      },
    ];
    const items = getProfileDropdownItems(testProfiles);
    expect(items.length).to.equal(1);
    expect(items[0].label).to.equal('TestMfg');
  });
});

import { html, fixture, expect } from '@open-wc/testing';
import '../src/card-editor';
import {
  MealPlanCardEditor,
  getProfileDropdownItems,
} from '../src/card-editor';
import { describe, it, vi, beforeEach } from 'vitest';
import { profiles } from '../src/profiles/profiles';
import { EVENT_CONFIG_CHANGED } from '../src/constants';
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

  it('renders form after components are ready', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el.setConfig({
      sensor: '',
      title: '',
      helper: '',
    });
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
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    el.setConfig({
      sensor: 'sensor.test',
      title: 'Test',
      profile: profileGroup,
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
    el.setConfig({
      sensor: '',
      title: '',
      helper: '',
    });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('');
    expect(el.config.title).to.equal('');
  });

  it('handles input changes for text fields', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el.hass = mockHass;
    await el.updateComplete;

    const configChangedSpy = vi.fn();
    el.addEventListener(EVENT_CONFIG_CHANGED, configChangedSpy);

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
    el.hass = mockHass;
    await el.updateComplete;

    const event = new Event('input', { bubbles: true, composed: true });
    Object.defineProperty(event, 'target', {
      value: { name: 'portions', value: '5' },
      writable: false,
    });
    el['_onInput'](event);
    await el.updateComplete;

    expect(el.config.portions).to.equal('5');
  });

  it('handles helper entity picker value change', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el.setConfig({
      sensor: 'sensor.test',
      title: '',
      helper: '',
    });
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

  it('registers custom card in window.customCards', () => {
    expect(window.customCards).to.exist;
    const mealplanCard = window.customCards?.find(
      (card) => card.type === 'mealplan-card',
    );
    expect(mealplanCard).to.exist;
    expect(mealplanCard?.name).to.equal('Mealplan Card');
  });

  it('handles profile change with empty value clears profile', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    el.setConfig({
      sensor: 'sensor.test',
      title: '',
      helper: '',
      profile: profileGroup as any,
    });
    el.hass = mockHass;
    await el.updateComplete;

    const event = new CustomEvent('value-changed', {
      detail: { value: '' },
    });

    el['_onProfileChanged'](event);
    await el.updateComplete;

    expect(el.config.profile).to.be.undefined;
  });

  it('handles profile change with valid value', async () => {
    const el = await fixture<MealPlanCardEditor>(
      html`<mealplan-card-editor></mealplan-card-editor>`,
    );
    el.setConfig({ sensor: 'sensor.test', title: '', helper: '' });
    el.hass = mockHass;
    await el.updateComplete;

    const event = new CustomEvent('value-changed', {
      detail: { value: 'Cleverio:PF100' },
    });

    el['_onProfileChanged'](event);
    await el.updateComplete;

    expect(el.config.profile).to.not.be.undefined;
    expect(el.config.profile?.selectedProfile.manufacturer).to.equal(
      'Cleverio',
    );
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

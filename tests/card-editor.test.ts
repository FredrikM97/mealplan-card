import { expect } from '@open-wc/testing';
import '../src/card-editor';
import {
  MealPlanCardEditor,
  getProfileDropdownItems,
} from '../src/card-editor';
import { describe, it, vi, beforeEach } from 'vitest';
import { profiles } from '../src/profiles/profiles';
import { EVENT_CONFIG_CHANGED, EVENT_VALUE_CHANGED } from '../src/constants';
import type { MealPlanCardConfig, DeviceProfile } from '../src/types';
import { testProfiles } from './fixtures/data';
import {
  createEditorMockHass,
  getCleverioProfile,
  createMealPlanCardConfig,
  createMinimalEditorConfig,
  createCardEditorFixture,
} from './fixtures/factories';

// Mock loadHaComponents to avoid timeouts in tests
vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

describe('MealPlanCardEditor', () => {
  let mockHass: any;

  beforeEach(() => {
    mockHass = createEditorMockHass();
  });

  it('renders form after components are ready', async () => {
    const el = await createCardEditorFixture();
    el.setConfig(createMinimalEditorConfig());
    el.hass = mockHass;
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('#sensor-picker')).to.exist;
    expect(el.shadowRoot?.querySelector('#helper-picker')).to.exist;
    expect(el.shadowRoot?.querySelector('#profile-combo')).to.exist;
    expect(el.shadowRoot?.querySelector('#title')).to.exist;
  });

  it('renders and updates config', async () => {
    const el = await createCardEditorFixture();
    el.hass = mockHass;
    await el.updateComplete;
    const config = createMealPlanCardConfig();
    el.setConfig(config);
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });

  it('initializes with default config', async () => {
    const el = await createCardEditorFixture();
    el.hass = mockHass;
    el.setConfig(createMinimalEditorConfig());
    await el.updateComplete;
    expect(el.config.sensor).to.equal('');
    expect(el.config.title).to.equal('');
  });

  it('handles input changes for text fields', async () => {
    const el = await createCardEditorFixture();
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
    const el = await createCardEditorFixture();
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
    const el = await createCardEditorFixture();
    el.setConfig(createMinimalEditorConfig({ sensor: 'sensor.test' }));
    el.hass = mockHass;
    await el.updateComplete;

    const helperPicker = el.shadowRoot?.querySelector('#helper-picker') as any;
    helperPicker.configValue = 'helper';
    helperPicker.dispatchEvent(
      new CustomEvent(EVENT_VALUE_CHANGED, {
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
    const el = await createCardEditorFixture();
    const config = createMealPlanCardConfig();
    el.setConfig(config);
    el.hass = mockHass;
    await el.updateComplete;

    const event = new CustomEvent(EVENT_VALUE_CHANGED, {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    });

    el['_onProfileChanged'](event);
    await el.updateComplete;

    expect(el.config.profile).to.be.undefined;
  });

  it('handles profile change with valid value', async () => {
    const el = await createCardEditorFixture();
    el.setConfig(createMinimalEditorConfig({ sensor: 'sensor.test' }));
    el.hass = mockHass;
    await el.updateComplete;

    const event = new CustomEvent(EVENT_VALUE_CHANGED, {
      detail: { value: 'Cleverio:PF100' },
      bubbles: true,
      composed: true,
    });

    el['_onProfileChanged'](event);
    await el.updateComplete;

    expect(el.config.profile).to.not.be.undefined;
    expect(el.config.profile?.manufacturer).to.equal('Cleverio');
  });
});

describe('getProfileDropdownItems', () => {
  it('returns dropdown items and handles different profile structures', () => {
    // Basic structure validation
    const items = getProfileDropdownItems(profiles);
    expect(items.length).to.be.greaterThan(0);
    expect(items[0]).to.have.property('value');
    expect(items[0]).to.have.property('label');

    // Multiple models
    const multiItems = getProfileDropdownItems(testProfiles.multipleModels());
    expect(multiItems.length).to.equal(2);
    expect(multiItems[0]!.label).to.include('TestMfg');
    expect(multiItems[0]!.label).to.include('Model1');
    expect(multiItems[1]!.label).to.include('Model2');

    // No models
    const noModelItems = getProfileDropdownItems(testProfiles.noModels());
    expect(noModelItems.length).to.equal(1);
    expect(noModelItems[0]!.label).to.equal('TestMfg');
    expect(noModelItems[0]!.value).to.equal('TestMfg:');

    // Single model
    const singleItems = getProfileDropdownItems(testProfiles.singleModel());
    expect(singleItems.length).to.equal(1);
    expect(singleItems[0]!.label).to.equal('TestMfg');
  });
});

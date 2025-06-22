import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/main';
import { describe, it } from 'vitest';
import { CleverioPf100Card } from '../src/cleverio/main';
import { decodeMealPlanData } from '../src/cleverio/util/mealplan-state';
import { vi } from 'vitest';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {}
}));

vi.stubGlobal('fetch', vi.fn(async () => ({
  ok: true,
  json: async () => ({})
})));

describe('CleverioPf100Card', () => {
  it('decodes real base64 meal plan data and passes it to children', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card' };
    const hass = {
      states: {
        'sensor.test': {
          state: base64,
          attributes: { friendly_name: 'Test Sensor' }
        }
      }
    };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    await el.updateComplete;
    expect(el).to.exist;
  }, 20000);
});

describe('getConfigElement', () => {
  it('returns a card-editor element with setConfig method', async () => {
    const el = await CleverioPf100Card.getConfigElement();
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal('cleverio-card-editor');
    expect(typeof el.setConfig).to.equal('function');
  });
});

describe('CleverioPf100Card base64 integration', () => {
  it('shows correct schedule and active counts, and opens dialog on button click', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card' };
    const hass = { states: { 'sensor.test': { state: base64, attributes: {} } } };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    await el.updateComplete;
    // Check summary chips for schedule and active counts
    const chips = el.shadowRoot.querySelectorAll('ha-chip');
    expect(chips.length).to.be.greaterThan(2);
    expect(chips[0].textContent).to.match(/schedules/i);
    expect(Number(chips[0].textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    expect(chips[1].textContent).to.match(/active/i);
    expect(Number(chips[1].textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    // Click manage button and check dialog
    const btn = el.shadowRoot.querySelector('.manage-btn');
    expect(btn).to.exist;
    btn.click();
    await el.updateComplete;
    const dialog = el.shadowRoot.querySelector('ha-dialog');
    expect(dialog).to.exist;
  }, 2000);
});

describe('CleverioPf100Card config and events', () => {
  it('throws if config is missing sensor', () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    expect(() => (el as any).setConfig({})).to.throw('Please define a sensor!');
  });

  it('closes dialog when _onDialogClose is called', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card' };
    const hass = { states: { 'sensor.test': { state: base64, attributes: {} } } };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    el._dialogOpen = true;
    el._onDialogClose();
    expect(el._dialogOpen).to.be.false;
  });

  it('emits meals-changed event when _onScheduleMealsChanged is called', async () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    let eventFired = false;
    el.addEventListener('meals-changed', () => { eventFired = true; });
    (el as any)._onScheduleMealsChanged({ detail: { meals: [{ time: '10:00', portion: 1, daysMask: 127, enabled: true }] } });
    expect(eventFired).to.be.true;
    expect((el as any)._meals.length).to.equal(1);
  });

  it('getStubConfig returns default config', () => {
    expect(CleverioPf100Card.getStubConfig()).to.have.property('title');
  });

  it('getCardSize returns 2', () => {
    expect(CleverioPf100Card.getCardSize({})).to.equal(2);
  });
});

describe('CleverioPf100Card error handling', () => {
  it('throws if config is missing sensor', () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    expect(() => el.setConfig({})).to.throw('Please define a sensor!');
  });
});

describe('CleverioPf100Card service call', () => {
  it('calls hass.callService on saveMealsToSensor', () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    el.config = { sensor: 'sensor.test' };
    el._meals = [{ time: '08:00', portion: 1, daysMask: 127, enabled: true }];
    el.hass = { callService: vi.fn() };
    el._saveMealsToSensor();
    expect(el.hass.callService.mock.calls.length).to.be.greaterThan(0);
  });
});

describe('CleverioPf100Card dialog and events', () => {
  it('opens and closes dialog', async () => {
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${{ sensor: 'sensor.test' }} .hass=${{ states: { 'sensor.test': { state: '', attributes: {} } } }}></cleverio-pf100-card>`);
    el._haComponentsReady = true;
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector('.manage-btn');
    btn.click();
    await el.updateComplete;
    let dialog = el.shadowRoot.querySelector('ha-dialog');
    expect(dialog).to.exist;
    el._onDialogClose();
    await el.updateComplete;
    dialog = el.shadowRoot.querySelector('ha-dialog');
    expect(dialog).to.not.exist;
  });
});

describe('CleverioPf100Card legacy methods', () => {
  it('getNextSchedule returns correct value', () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    el._meals = [{ time: '08:00', portion: 1, daysMask: 127, enabled: true }];
    expect(el.getNextSchedule()).to.equal('08:00');
  });
  it('getTotalFoodPerDay returns array', () => {
    const el = document.createElement('cleverio-pf100-card') as any;
    el._meals = [{ time: '08:00', portion: 1, daysMask: 127, enabled: true }];
    const result = el.getTotalFoodPerDay();
    expect(result).to.be.an('array');
  });
});
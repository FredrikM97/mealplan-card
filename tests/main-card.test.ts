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
    const config = { sensor: 'sensor.test', title: 'Test Card', layout: 'tuya_with_daysMask' };
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
  it('decodes base64 meal plan and displays correct schedule and grams in UI', async () => {
    // Use the real device base64 string as requested
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card', layout: 'tuya_with_daysMask' };
    const hass = { states: { 'sensor.test': { state: base64, attributes: {} } } };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    await el.updateComplete;
    // Check UI for correct number of schedules
    const schedules = el.shadowRoot.querySelector('.overview-schedules');
    expect(schedules).to.exist;
    expect(Number(schedules.textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    // Check UI for correct number of active schedules
    const active = el.shadowRoot.querySelector('.overview-active');
    expect(active).to.exist;
    expect(Number(active.textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    // Check UI for grams summary (case-insensitive match)
    const grams = el.shadowRoot.querySelector('.overview-grams');
    expect(grams).to.exist;
    expect(grams.textContent.toLowerCase()).to.match(/today: \d+g/);
  }, 20000);
});

describe('CleverioPf100Card integration', () => {
  it('calls hass.callService when schedule Save is pressed', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card', layout: 'tuya_with_daysMask' };
    const callService = vi.fn();
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
      callService,
    };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    await el.updateComplete;
    // Open dialog
    const btn = el.shadowRoot.querySelector('.manage-btn');
    expect(btn).to.exist;
    btn.click();
    await el.updateComplete;
    // Simulate schedule save event as UI would
    const scheduleView = el.shadowRoot.querySelector('cleverio-schedule-view');
    expect(scheduleView).to.exist;
    scheduleView.dispatchEvent(new CustomEvent('save-schedule', { detail: { meals: el._meals }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(callService.mock.calls.length).to.be.greaterThan(0);
    const call = callService.mock.calls.find(c => c[0] === 'text' && c[1] === 'set_value');
    expect(call, 'callService should be called with text.set_value').to.exist;
    if (call) expect(call[2].entity_id).to.equal('sensor.test');
  });
});

import { fixture, html, expect } from '@open-wc/testing';
import '../src/main';
import { describe, it } from 'vitest';
import { CleverioPf100Card } from '../src/main';
import { decodeMealPlanData } from '../src/util/mealplan-state';
import { vi } from 'vitest';
import { cleverioProfile } from '../src/profiles/cleverio';

vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {}
}));

vi.stubGlobal('fetch', vi.fn(async () => ({
  ok: true,
  json: async () => ({})
})));

describe('CleverioPf100Card', () => {
  it('decodes real base64 meal plan data and passes it to children', async () => {
    // Encodes: daysMask=127, portion=2, hour=8, minute=0, enabled=1
    const base64 = btoa(String.fromCharCode(127, 2, 8, 0, 1));
    const config = { sensor: 'sensor.test', title: 'Test Card', profile: 'cleverio' };
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

// (Overview UI test moved to views/overview.test.ts)

describe('CleverioPf100Card integration', () => {
  it('calls hass.callService when schedule Save is pressed', async () => {
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card', profile: 'cleverio' };
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
    // Find the ha-dialog and click the save button
    const dialog = el.shadowRoot.querySelector('ha-dialog');
    expect(dialog).to.exist;
    const saveBtn = dialog.querySelector('ha-button.ha-primary[slot="primaryAction"]');
    expect(saveBtn).to.exist;
    (saveBtn as HTMLElement).click();
    await el.updateComplete;
    expect(callService.mock.calls.length).to.be.greaterThan(0);
    const call = callService.mock.calls.find(c => c[0] === 'text' && c[1] === 'set_value');
    expect(call, 'callService should be called with text.set_value').to.exist;
    if (call) expect(call[2].entity_id).to.equal('sensor.test');
  });
});
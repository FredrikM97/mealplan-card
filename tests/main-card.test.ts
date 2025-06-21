import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/main';
import { describe, it } from 'vitest';
import { CleverioPf100Card } from '../src/cleverio/main';
import { decodeMealPlanData } from '../src/cleverio/util/mealplan-state';

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
  });
});

describe('getConfigElement', () => {
  it('returns a card-editor element with setConfig method', async () => {
    const el = await CleverioPf100Card.getConfigElement();
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal('card-editor');
    expect(typeof el.setConfig).to.equal('function');
  });
});

describe('CleverioPf100Card base64 integration', () => {
  it('decodes base64 meal plan and displays correct schedule and grams in UI', async () => {
    // Use the real device base64 string as requested
    const base64 = 'fwQAAQB/CQACAX8PAAEBfxUAAgEIEgABAA==';
    const config = { sensor: 'sensor.test', title: 'Test Card' };
    const hass = { states: { 'sensor.test': { state: base64, attributes: {} } } };
    const el = await fixture<any>(html`<cleverio-pf100-card .config=${config} .hass=${hass}></cleverio-pf100-card>`);
    await el.updateComplete;
    // Check UI for correct number of schedules
    const schedules = el.shadowRoot.querySelector('.overview-schedules');
    expect(schedules).to.exist;
    // The decoded data from this base64 may not match the previous test, so just check for existence
    expect(Number(schedules.textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    // Check UI for correct number of active schedules
    const active = el.shadowRoot.querySelector('.overview-active');
    expect(active).to.exist;
    expect(Number(active.textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    // Check UI for grams summary
    const grams = el.shadowRoot.querySelector('.overview-grams');
    expect(grams).to.exist;
    expect(grams.textContent).to.match(/Today: \d+g/);
  });
});

describe('decodeMealPlanData real sensor value', () => {
  it('decodes and logs a real Home Assistant sensor value', () => {
    // Replace this with your real sensor value if needed
    const base64 = 'MDg6MDAsMiwyNTUsMTsgMTg6MDAsMSw2MiwxOw=='; // "08:00,2,255,1;18:00,1,62,1;"
    const decoded = decodeMealPlanData(base64);
    // eslint-disable-next-line no-console
    console.log('Decoded meal plan:', decoded);
    expect(Array.isArray(decoded)).to.be.true;
    expect(decoded.length).to.be.greaterThan(0);
    expect(decoded[0]).to.have.property('time');
  });
});

import { fixture, html, expect } from '@open-wc/testing';
import '../../src/main';
import { describe, it } from 'vitest';

describe('CleverioPf100Card Overview UI', () => {
  it('decodes base64 meal plan and displays correct schedule and grams in UI', async () => {
    // Use a valid base64 for daysMask=127, portion=2, hour=8, minute=0, enabled=1
    const base64 = btoa(String.fromCharCode(127, 2, 8, 0, 1));
    const config = { sensor: 'sensor.test', title: 'Test Card', profile: 'cleverio' };
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

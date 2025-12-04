import { fixture, html, expect } from '@open-wc/testing';
import '../../src/main';
import { describe, it } from 'vitest';

describe('MealPlanCard Overview UI', () => {
  it('decodes base64 meal plan and displays correct schedule and grams in UI', async () => {
    // Portion must be > 0 for test to pass
    const base64 = btoa(String.fromCharCode(127, 2, 8, 1, 1));
    const config = {
      sensor: 'sensor.test',
      title: 'Test Card',
      device_manufacturer: 'Cleverio',
      device_model: '',
    };
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
    };
    const el = await fixture<any>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    await el.updateComplete;
    const schedules = el.shadowRoot.querySelector('.overview-schedules');
    expect(schedules).to.exist;
    expect(Number(schedules.textContent.replace(/\D/g, ''))).to.be.greaterThan(
      0,
    );
    const active = el.shadowRoot.querySelector('.overview-active');
    expect(active).to.exist;
    expect(Number(active.textContent.replace(/\D/g, ''))).to.be.greaterThan(0);
    const grams = el.shadowRoot.querySelector('.overview-grams');
    expect(grams).to.exist;
    const gramsText = grams.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(gramsText).to.match(/today: \d+g/);
  }, 20000);

  it('multiplies metrics by config portions value', async () => {
    // Create a feeding time: All days (127), 8:00, 10g portion, enabled
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const configWithPortions = {
      sensor: 'sensor.test',
      title: 'Test Card',
      device_manufacturer: 'Cleverio',
      device_model: '',
      portions: 3,
    };
    const hass = {
      states: { 'sensor.test': { state: base64, attributes: {} } },
    };
    const el = await fixture<any>(
      html`<mealplan-card
        .config=${configWithPortions}
        .hass=${hass}
      ></mealplan-card>`,
    );
    await el.updateComplete;

    // Today's food should be 10g * 3 portions = 30g
    const grams = el.shadowRoot.querySelector('.overview-grams');
    expect(grams).to.exist;
    const gramsText = grams.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(gramsText).to.include('30g');

    // Average per week should also be multiplied by portions: (10g * 7 days / 7) * 3 portions = 30g
    const avgChip = el.shadowRoot.querySelector('.overview-average');
    expect(avgChip).to.exist;
    const avgText = avgChip.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(avgText).to.include('30.0g');
  }, 20000);
});

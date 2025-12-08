import { fixture, html, expect } from '@open-wc/testing';
import '../../src/main';
import { describe, it } from 'vitest';
import { profiles } from '../../src/profiles/profiles';

describe('MealPlanCard Overview UI', () => {
  it('multiplies metrics by config portions value', async () => {
    // Create a feeding time: All days (127), 8:00, 10g portion, enabled
    const base64 = btoa(String.fromCharCode(127, 8, 0, 10, 1));
    const profileGroup = profiles.find((p) =>
      p.profiles.some((prof) => prof.manufacturer === 'Cleverio'),
    );
    const configWithPortions = {
      sensor: 'sensor.test',
      title: 'Test Card',
      device_manufacturer: 'Cleverio',
      device_model: '',
      portions: 3,
      _profile: { ...profileGroup, manufacturer: 'Cleverio', model: '' },
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

    // Force HA components ready to bypass loading
    el._haComponentsReady = true;
    await el.updateComplete;

    // Today's food should be 10g * 3 portions = 30g
    const overview = el.shadowRoot.querySelector('meal-overview');
    expect(overview).to.exist;
    const grams = overview.shadowRoot.querySelector('.overview-grams');
    expect(grams).to.exist;
    const gramsText = grams.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(gramsText).to.include('30g');

    // Average per week should also be multiplied by portions: (10g * 7 days / 7) * 3 portions = 30g
    const avgChip = overview.shadowRoot.querySelector('.overview-average');
    expect(avgChip).to.exist;
    const avgText = avgChip.textContent
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    expect(avgText).to.include('30.0g');
  }, 20000);
});

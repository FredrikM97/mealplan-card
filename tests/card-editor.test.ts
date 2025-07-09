import { html, fixture, expect } from '@open-wc/testing';
import '../src/card-editor';
import { MealPlanCardEditor } from '../src/card-editor';
import { describe, it, vi } from 'vitest';

// Mock loadHaComponents to avoid timeouts in tests
vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {}
}));

describe('MealPlanCardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture<MealPlanCardEditor>(html`<mealplan-card-editor></mealplan-card-editor>`);
    await el.updateComplete;
    el.setConfig({
      sensor: 'sensor.test', title: 'Test', profile: 'cleverio', helper: ''
    });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });

  it('renders inputs and updates config via UI', async () => {
    const el = await fixture<MealPlanCardEditor>(html`<mealplan-card-editor></mealplan-card-editor>`);
    await customElements.whenDefined('mealplan-card-editor');
    await el.updateComplete;
    const shadow = el.shadowRoot!;
    expect(shadow).to.exist;
    const entityPicker = shadow.querySelector('ha-entity-picker');
    const textField = shadow.querySelector('ha-textfield');
    expect(entityPicker).to.exist;
    expect(textField).to.exist;


    (entityPicker as any).value = 'sensor.test';
    entityPicker!.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'sensor.test' }, bubbles: true, composed: true }));

    (textField as any).name = 'title';
    (textField as any).value = 'My Title';
    textField!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    const profileCombo = shadow.querySelector('#profile-combo');
    if (profileCombo) {
      (profileCombo as any).value = 'cleverio';
      profileCombo.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'cleverio' }, bubbles: true, composed: true }));
    }

    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('My Title');
    expect(el.config.profile).to.equal('cleverio');
  });
});

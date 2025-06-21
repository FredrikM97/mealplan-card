import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/Edit.js';

describe('CleverioEditDialog', () => {
  it('should render without crashing', () => {
    // TODO: Add real tests
    expect(true).to.be.true;
  });
});

describe('CleverioEditView', () => {
  it('renders with default state and emits save event', async () => {
    const el = await fixture(html`<cleverio-edit-view></cleverio-edit-view>`);
    await el.updateComplete;
    // ha-textfield is a custom element, so we need to query for it
    const timeInput = el.shadowRoot.querySelector('ha-textfield.edit-time');
    expect(timeInput).to.exist;
    timeInput.value = '09:00';
    timeInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    // Simulate save
    const saveBtn = el.shadowRoot.querySelector('ha-button.edit-save-btn');
    setTimeout(() => saveBtn.click());
    const e = await oneEvent(el, 'save');
    expect(e.detail.meal.time).to.equal('09:00');
  });
});

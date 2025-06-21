import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/CardEditor.js';

describe('CleverioPf100CardEditor', () => {
  it('renders inputs and updates config', async () => {
    const el = await fixture(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    await el.updateComplete;
    const inputs = el.shadowRoot.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
    inputs[0].value = 'sensor.test';
    inputs[0].dispatchEvent(new Event('input'));
    inputs[1].value = 'My Title';
    inputs[1].dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('My Title');
    // Should fire config-changed event
    setTimeout(() => inputs[0].dispatchEvent(new Event('input')));
    const e = await oneEvent(el, 'config-changed');
    expect(e.detail.config.sensor).to.equal('sensor.test');
  });
});

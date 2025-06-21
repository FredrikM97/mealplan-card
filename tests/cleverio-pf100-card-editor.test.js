import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/CardEditor.js';

describe('CleverioPF100CardEditor', () => {
  it('renders with default config', async () => {
    const el = await fixture(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    expect(el).to.exist;
    expect(el.shadowRoot.querySelector('input[name="sensor"]')).to.exist;
    expect(el.shadowRoot.querySelector('input[name="title"]')).to.exist;
  });

  it('reflects config values in inputs', async () => {
    const el = await fixture(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    el.setConfig({ sensor: 'sensor.test', title: 'Test Title' });
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('input[name="sensor"]').value).to.equal('sensor.test');
    expect(el.shadowRoot.querySelector('input[name="title"]').value).to.equal('Test Title');
  });

  it('emits config-changed on input', async () => {
    const el = await fixture(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    el.setConfig({ sensor: '', title: '' });
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[name="sensor"]');
    let changed = false;
    el.addEventListener('config-changed', e => { changed = true; });
    input.value = 'sensor.new';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(changed).to.be.true;
    expect(el.config.sensor).to.equal('sensor.new');
  });
});

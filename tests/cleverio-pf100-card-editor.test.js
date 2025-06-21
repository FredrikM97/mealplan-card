import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/CardEditor.js';

describe('CleverioPF100CardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    await el.updateComplete;
    el.config = { sensor: 'sensor.test', title: 'Test' };
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });
});

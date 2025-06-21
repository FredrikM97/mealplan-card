import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/card-editor';
import { CleverioPf100CardEditor } from '../src/cleverio/card-editor';
import { describe, it } from 'vitest';

describe('CleverioPf100CardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture<CleverioPf100CardEditor>(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    await el.updateComplete;
    el.setConfig({ sensor: 'sensor.test', title: 'Test' });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });
});

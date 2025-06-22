import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/card-editor';
import { CleverioCardEditor } from '../src/cleverio/card-editor';
import { describe, it } from 'vitest';

describe('CleverioCardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture<CleverioCardEditor>(html`<cleverio-card-editor></cleverio-card-editor>`);
    await el.updateComplete;
    el.setConfig({ sensor: 'sensor.test', title: 'Test' });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });
});

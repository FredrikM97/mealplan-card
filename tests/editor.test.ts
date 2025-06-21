import { html, fixture, expect } from '@open-wc/testing';
import '../src/cleverio/card-editor';
import { CardEditor } from '../src/cleverio/card-editor';
import { describe, it } from 'vitest';

describe('CleverioPF100CardEditor', () => {
  it('renders and updates config', async () => {
    const el = await fixture<CardEditor>(html`<card-editor></card-editor>`);
    await el.updateComplete;
    el.setConfig({ sensor: 'sensor.test', title: 'Test' });
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('Test');
  });
});

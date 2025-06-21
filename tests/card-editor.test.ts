import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import { CleverioPf100CardEditor } from '../src/cleverio/card-editor';
import '../src/cleverio/card-editor';
import { describe, it } from 'vitest';

describe('CleverioPf100CardEditor', () => {
  it('renders inputs and updates config', async () => {
    const el = await fixture<CleverioPf100CardEditor>(html`<cleverio-pf100-card-editor></cleverio-pf100-card-editor>`);
    await customElements.whenDefined('cleverio-pf100-card-editor');
    await el.updateComplete;
    const shadow = el.shadowRoot!;
    expect(shadow).to.exist;
    const inputs = shadow.querySelectorAll('input');
    expect(inputs.length).to.equal(2);
    (inputs[0] as HTMLInputElement).value = 'sensor.test';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    (inputs[1] as HTMLInputElement).value = 'My Title';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.config.sensor).to.equal('sensor.test');
    expect(el.config.title).to.equal('My Title');
  });
});

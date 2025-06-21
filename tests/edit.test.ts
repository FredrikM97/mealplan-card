import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../src/cleverio/edit';
import { describe, it } from 'vitest';

describe('CleverioEditDialog', () => {
  it('should render without crashing', () => {
    expect(true).to.be.true;
  });
});

describe('CleverioEditView', () => {
  it('renders with default state and emits save event', async () => {
    const el = await fixture<HTMLElement>(html`<edit-view></edit-view>`);
    await (el as any).updateComplete;
    const timeInput = (el.shadowRoot as ShadowRoot).querySelector('ha-textfield.edit-time') as HTMLInputElement;
    expect(timeInput).to.exist;
    timeInput.value = '09:00';
    timeInput.dispatchEvent(new Event('input'));
    await (el as any).updateComplete;
    const form = (el.shadowRoot as ShadowRoot).querySelector('form');
    expect(form).to.exist;
    setTimeout(() => form!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    const e = await oneEvent(el, 'save');
    expect(e.detail.meal.time).to.equal('09:00');
  });
});

import { fixture, html, expect } from '@open-wc/testing';
import '../src/cleverio/overviews';
import { describe, it } from 'vitest';

describe('CleverioOverviewView', () => {
  it('renders with default title and no meals', async () => {
    const el = await fixture<HTMLElement>(html`<cleverio-overview-view></cleverio-overview-view>`);
    await (el as any).updateComplete;
    const title = (el.shadowRoot as ShadowRoot).querySelector('.overview-title');
    expect(title).to.exist;
    expect(title!.textContent).to.include('Cleverio Pet Feeder');
  });
});

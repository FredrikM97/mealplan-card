import { fixture, html, expect } from '@open-wc/testing';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import '../../src/components/message-display';
import {
  EVENT_MEAL_MESSAGE,
  EVENT_CLEAR_MESSAGE,
  MESSAGE_TYPE_ERROR,
  MESSAGE_TYPE_INFO,
  MealMessageEvent,
} from '../../src/constants';

// Mock HA components
vi.mock('@kipk/load-ha-components', () => ({
  loadHaComponents: async () => {},
}));

describe('MealMessageDisplay', () => {
  let el: any;

  beforeEach(async () => {
    el = await fixture(html`<meal-message-display></meal-message-display>`);
  });

  afterEach(() => {
    if (el.dismissTimeout) {
      clearTimeout(el.dismissTimeout);
    }
  });

  it('renders nothing when no message', async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.message')).to.not.exist;
  });

  it('displays info message when EVENT_MEAL_MESSAGE is dispatched', async () => {
    const event = new MealMessageEvent('Test info message', MESSAGE_TYPE_INFO);
    window.dispatchEvent(event);
    await el.updateComplete;

    const messageDiv = el.shadowRoot?.querySelector('.message');
    expect(messageDiv).to.exist;
    expect(messageDiv?.textContent).to.include('Test info message');
    expect(messageDiv?.classList.contains('info')).to.be.true;
  });

  it('displays error message when EVENT_MEAL_MESSAGE is dispatched with error type', async () => {
    const event = new MealMessageEvent(
      'Test error message',
      MESSAGE_TYPE_ERROR,
    );
    window.dispatchEvent(event);
    await el.updateComplete;

    const messageDiv = el.shadowRoot?.querySelector('.message');
    expect(messageDiv).to.exist;
    expect(messageDiv?.textContent).to.include('Test error message');
    expect(messageDiv?.classList.contains('error')).to.be.true;
  });

  it('clears message when EVENT_CLEAR_MESSAGE is dispatched', async () => {
    const showEvent = new MealMessageEvent('Test message', MESSAGE_TYPE_INFO);
    window.dispatchEvent(showEvent);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.message')).to.exist;

    const clearEvent = new CustomEvent(EVENT_CLEAR_MESSAGE, {
      bubbles: true,
      composed: true,
    });
    window.dispatchEvent(clearEvent);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('.message')).to.not.exist;
  });

  it('clears message when dismiss icon is clicked', async () => {
    const event = new MealMessageEvent(
      'Dismissable message',
      MESSAGE_TYPE_INFO,
    );
    window.dispatchEvent(event);
    await el.updateComplete;

    const dismissIcon = el.shadowRoot?.querySelector('.dismiss-button');
    expect(dismissIcon).to.exist;

    dismissIcon?.click();
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('.message')).to.not.exist;
  });

  it('auto-dismisses message after timeout', async () => {
    vi.useFakeTimers();

    const event = new MealMessageEvent('Auto dismiss', MESSAGE_TYPE_INFO);
    window.dispatchEvent(event);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.message')).to.exist;

    vi.advanceTimersByTime(10000);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('.message')).to.not.exist;

    vi.useRealTimers();
  });

  it('clears previous timeout when new message arrives', async () => {
    vi.useFakeTimers();

    const event1 = new MealMessageEvent('First message', MESSAGE_TYPE_INFO);
    window.dispatchEvent(event1);
    await el.updateComplete;

    vi.advanceTimersByTime(5000);
    const event2 = new MealMessageEvent('Second message', MESSAGE_TYPE_INFO);
    window.dispatchEvent(event2);
    await el.updateComplete;

    const messageText =
      el.shadowRoot?.querySelector('.message-text')?.textContent;
    expect(messageText).to.include('Second message');

    vi.useRealTimers();
  });

  it('removes event listeners on disconnect', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    el.remove();

    expect(
      removeEventListenerSpy.mock.calls.some(
        (call) => call[0] === EVENT_MEAL_MESSAGE && call[2] === true,
      ),
    ).to.be.true;
    expect(
      removeEventListenerSpy.mock.calls.some(
        (call) => call[0] === EVENT_CLEAR_MESSAGE && call[2] === true,
      ),
    ).to.be.true;

    removeEventListenerSpy.mockRestore();
  });
});

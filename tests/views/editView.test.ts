import { html, render } from 'lit';
import { expect, describe, it, vi } from 'vitest';
import { renderEditView } from '../../src/views/editView';
import { cleverioProfile } from '../../src/profiles/cleverio';

// Register minimal mocks for missing Home Assistant custom elements
class HaButtonMock extends HTMLElement {}
if (!customElements.get('ha-button')) {
  customElements.define('ha-button', HaButtonMock);
}
class HaChipMock extends HTMLElement {}
if (!customElements.get('ha-chip')) {
  customElements.define('ha-chip', HaChipMock);
}

const editForm = { hour: 8, minute: 0, portion: 2, daysMask: 127, enabled: 1 };
const predefinedTimes = ['08:00', '12:00', '18:00'];

describe('renderEditView (function)', () => {
  it('renders the edit form with required fields', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        predefinedTimes,
        onUpdate: vi.fn()
      }),
      container
    );
    await new Promise(r => setTimeout(r, 10));
    // Check for portion input
    const portionInput = container.querySelector('#edit-portion');
    expect(portionInput).to.exist;
    // Check for time input
    const timeInput = container.querySelector('#edit-time');
    expect(timeInput).to.exist;
    // Check for day selector
    const daySelector = container.querySelector('cleverio-day-selector');
    expect(daySelector).to.exist;
    // Check for form class
    const form = container.querySelector('.edit-form');
    expect(form).to.exist;
    document.body.removeChild(container);
  });

  it('renders error message if editError is set', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: 'Test error',
        predefinedTimes,
        onUpdate: vi.fn()
      }),
      container
    );
    await new Promise(r => setTimeout(r, 10));
    const errorDiv = container.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent).toContain('Test error');
    document.body.removeChild(container);
  });

  it('renders predefined time buttons', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        predefinedTimes,
        onUpdate: vi.fn()
      }),
      container
    );
    await new Promise(r => setTimeout(r, 10));
    const buttons = container.querySelectorAll('ha-button');
    expect(buttons.length).toBe(predefinedTimes.length);
    document.body.removeChild(container);
  });
});

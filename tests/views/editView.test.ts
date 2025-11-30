import { html, render } from 'lit';
import { expect, describe, it, vi } from 'vitest';
import { renderEditView } from '../../src/views/editView';
import { profiles } from '../../src/profiles/profiles';
const cleverioProfile = profiles.find((group) =>
  group.profiles.some((p) => p.manufacturer === 'Cleverio'),
)!;

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
const predefinedTimes = ['06:00', '08:00', '12:00', '18:00', '21:00'];

describe('renderEditView (function)', () => {
  it('renders the edit form with required fields', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const portionInput = container.querySelector('#edit-portion');
    expect(portionInput).to.exist;
    const timeInput = container.querySelector('#edit-time');
    expect(timeInput).to.exist;
    const daySelector = container.querySelector('.days-row');
    expect(daySelector).to.exist;
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
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const errorDiv = container.querySelector('.error');
    expect(errorDiv).to.exist;
    expect(errorDiv?.textContent).toContain('Test error');
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
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const buttons = container.querySelectorAll('ha-button');
    expect(buttons.length).toBe(5);
    document.body.removeChild(container);
  });

  it('calls onUpdate when time input changes', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onUpdate = vi.fn();
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        onUpdate,
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const timeInput = container.querySelector('#edit-time') as HTMLInputElement;
    expect(timeInput).to.exist;
    timeInput.value = '14:30';
    timeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onUpdate).toHaveBeenCalledWith({ hour: 14, minute: 30 });
    document.body.removeChild(container);
  });

  it('calls onUpdate when portion input changes', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onUpdate = vi.fn();
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        onUpdate,
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const portionInput = container.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    expect(portionInput).to.exist;
    portionInput.value = '5';
    portionInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onUpdate).toHaveBeenCalledWith({ portion: 5 });
    document.body.removeChild(container);
  });

  it('calls onUpdate when predefined time button is clicked', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onUpdate = vi.fn();
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        onUpdate,
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const buttons = container.querySelectorAll('ha-button');
    expect(buttons.length).toBe(5);
    // Click the first predefined time button (06:00)
    (buttons[0] as HTMLElement).click();
    expect(onUpdate).toHaveBeenCalledWith({ hour: 6, minute: 0 });
    document.body.removeChild(container);
  });

  it('does not render portion field when profile.fields excludes it', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const profileWithoutPortion = {
      ...cleverioProfile,
      fields: ['days', 'enabled'], // No 'portion'
    };
    render(
      renderEditView({
        profile: profileWithoutPortion,
        editForm,
        editError: null,
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const portionInput = container.querySelector('#edit-portion');
    expect(portionInput).to.not.exist;
    document.body.removeChild(container);
  });

  it('does not render day selector when profile.fields excludes days', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const profileWithoutDays = {
      ...cleverioProfile,
      fields: ['portion', 'enabled'], // No 'days'
    };
    render(
      renderEditView({
        profile: profileWithoutDays,
        editForm,
        editError: null,
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const daySelector = container.querySelector('.days-row');
    expect(daySelector).to.not.exist;
    document.body.removeChild(container);
  });

  it('handles null editForm gracefully', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm: null,
        editError: null,
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const timeInput = container.querySelector('#edit-time') as HTMLInputElement;
    expect(timeInput).to.exist;
    expect(timeInput.value).toBe('');
    const portionInput = container.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    expect(portionInput).to.exist;
    expect(portionInput.value).toBe('1'); // Default value
    document.body.removeChild(container);
  });

  it('prevents form submission', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderEditView({
        profile: cleverioProfile,
        editForm,
        editError: null,
        onUpdate: vi.fn(),
      }),
      container,
    );
    await new Promise((r) => setTimeout(r, 10));
    const form = container.querySelector('.edit-form') as HTMLFormElement;
    expect(form).to.exist;
    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    const defaultPrevented = !form.dispatchEvent(submitEvent);
    expect(defaultPrevented).toBe(true);
    document.body.removeChild(container);
  });
});

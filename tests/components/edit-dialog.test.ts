import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../../src/components/edit-dialog.js';
import { MealEditDialog } from '../../src/components/edit-dialog.js';
import { EVENT_SAVE } from '../../src/constants.js';
import type { FeedingTime } from '../../src/types.js';
import { ProfileField } from '../../src/types.js';
import { testMeals } from '../fixtures/data';
import {
  createMockProfile,
  createEditDialogFixture,
} from '../fixtures/factories';

describe('MealEditDialog', () => {
  const mockProfile = createMockProfile();

  const mockMeal: FeedingTime = {
    hour: 8,
    minute: 30,
    portion: 2,
    days: 127,
    enabled: 1,
  };

  let el: MealEditDialog;

  beforeEach(async () => {
    el = (await createEditDialogFixture({
      profile: mockProfile,
      meal: mockMeal,
    })) as MealEditDialog;
  });

  it('renders when open and respects profile fields', async () => {
    // Renders edit form when open
    expect(el.shadowRoot?.querySelector('.edit-form')).to.exist;

    // Renders time input
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    expect(timeInput).to.exist;
    expect(timeInput.value).toBe('08:30');

    // Renders portion field (included in profile)
    const portionInput = el.shadowRoot?.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    expect(portionInput).to.exist;
    expect(portionInput.value).toBe('2');

    // Renders days selector (included in profile)
    const daysContainer = el.shadowRoot?.querySelector('.days-row');
    expect(daysContainer).to.exist;
  });

  it('does not render when closed or without profile', async () => {
    const closedEl = (await createEditDialogFixture({
      open: false,
    })) as MealEditDialog;
    expect(closedEl.shadowRoot?.querySelector('.edit-form')).to.not.exist;

    const noProfileEl = (await createEditDialogFixture()) as MealEditDialog;
    expect(noProfileEl.shadowRoot?.querySelector('.edit-form')).to.not.exist;
  });

  it('does not render fields excluded from profile', async () => {
    const noPortionProfile = createMockProfile({ fields: [ProfileField.DAYS] });
    const noPortionEl = (await createEditDialogFixture({
      profile: noPortionProfile,
      meal: mockMeal,
    })) as MealEditDialog;
    expect(noPortionEl.shadowRoot?.querySelector('#edit-portion')).to.not.exist;

    const noDaysProfile = createMockProfile({ fields: [ProfileField.PORTION] });
    const noDaysEl = (await createEditDialogFixture({
      profile: noDaysProfile,
      meal: mockMeal,
    })) as MealEditDialog;
    expect(noDaysEl.shadowRoot?.querySelector('.days-row')).to.not.exist;
  });

  it('initializes and updates formData', async () => {
    // Initializes from meal prop
    expect(el['formData']).to.deep.equal(mockMeal);

    // Updates when meal prop changes
    const newMeal: FeedingTime = {
      hour: 12,
      minute: 0,
      portion: 3,
      days: 31,
      enabled: 1,
    };
    el.meal = newMeal;
    await el.updateComplete;
    expect(el['formData']).to.deep.equal(newMeal);
  });

  it('handles input changes', async () => {
    // Time input
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    timeInput.value = '12:45';
    timeInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el['formData'].hour).toBe(12);
    expect(el['formData'].minute).toBe(45);

    // Portion input
    const portionInput = el.shadowRoot?.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    portionInput.value = '5';
    portionInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el['formData'].portion).toBe(5);
  });

  it('renders and handles predefined time buttons', async () => {
    const buttons = el.shadowRoot?.querySelectorAll(
      '.edit-predefined-times ha-button',
    );
    expect(buttons?.length).to.be.greaterThan(0);

    // Click first button (06:00)
    const button = buttons?.[0] as HTMLElement;
    button.click();
    await el.updateComplete;
    expect(el['formData'].hour).toBe(6);
    expect(el['formData'].minute).toBe(0);
  });

  it('dispatches save event with formData', async () => {
    const saveSpy = vi.fn();
    el.addEventListener(EVENT_SAVE, saveSpy);

    el.handleSave();
    await el.updateComplete;

    expect(saveSpy).toHaveBeenCalledOnce();
    expect(saveSpy.mock.calls[0][0].detail.meal).to.deep.equal(el['formData']);
    expect(saveSpy.mock.calls[0][0].detail.index).to.equal(el.index);
  });

  it('validates time input', async () => {
    el['formData'] = { hour: -1, minute: 0, portion: 1 };

    const saveSpy = vi.fn();
    el.addEventListener(EVENT_SAVE, saveSpy);

    el.handleSave();
    await el.updateComplete;

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents form submission', async () => {
    const form = el.shadowRoot?.querySelector('form');
    const submitEvent = new Event('submit', { cancelable: true });
    form?.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it('updates formData via handleUpdate and preserves unchanged fields', async () => {
    const original = { ...el['formData'] };

    // Updates specific fields via handleUpdate
    el['handleUpdate']({ hour: 15, minute: 30 });
    await el.updateComplete;
    expect(el['formData'].hour).toBe(15);
    expect(el['formData'].minute).toBe(30);
    expect(el['formData'].portion).toBe(2); // Unchanged

    // Updates days
    el['handleUpdate']({ days: 31 });
    await el.updateComplete;
    expect(el['formData'].days).toBe(31);

    // Preserves existing data when updating single field
    el['handlePortionInput']({ target: { value: '10' } } as any);
    await el.updateComplete;
    expect(el['formData'].portion).toBe(10);
    expect(el['formData'].hour).toBe(15); // Still updated value
  });

  it('handles time input with leading zeros', async () => {
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    timeInput.value = '06:05';
    timeInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el['formData'].hour).toBe(6);
    expect(el['formData'].minute).toBe(5);
  });
});

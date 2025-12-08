import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../../src/components/edit-dialog.js';
import {
  MealEditDialog,
  formatHourMinute,
} from '../../src/components/edit-dialog.js';
import type { FeedingTime } from '../../src/types.js';
import { DeviceProfileGroup, ProfileField } from '../../src/types.js';

describe('formatHourMinute', () => {
  it('formats valid time as HH:MM', () => {
    expect(formatHourMinute(6, 30)).toBe('06:30');
    expect(formatHourMinute(12, 0)).toBe('12:00');
    expect(formatHourMinute(23, 59)).toBe('23:59');
  });

  it('returns --:-- for invalid values', () => {
    expect(formatHourMinute(undefined, 30)).toBe('--:--');
    expect(formatHourMinute(6, undefined)).toBe('--:--');
    expect(formatHourMinute(24, 0)).toBe('--:--');
    expect(formatHourMinute(-1, 0)).toBe('--:--');
    expect(formatHourMinute(12, 60)).toBe('--:--');
    expect(formatHourMinute(12, -1)).toBe('--:--');
    expect(formatHourMinute(NaN, 0)).toBe('--:--');
    expect(formatHourMinute(0, NaN)).toBe('--:--');
  });
});

describe('MealEditDialog', () => {
  const mockProfile: DeviceProfileGroup = {
    profiles: [{ manufacturer: 'Test', default: true }],
    encodingTemplate: '{DAYS:8}{HOUR:5}{MINUTE:6}{PORTION:4}{ENABLED:1}',
    firstDay: 0,
    fields: [ProfileField.DAYS, ProfileField.PORTION],
  };

  const mockMeal: FeedingTime = {
    hour: 8,
    minute: 30,
    portion: 2,
    days: 127,
    enabled: 1,
  };

  let el: MealEditDialog;

  beforeEach(async () => {
    el = await fixture<MealEditDialog>(html`
      <meal-edit-dialog
        .open=${true}
        .profile=${mockProfile}
        .meal=${mockMeal}
      ></meal-edit-dialog>
    `);
  });

  it('renders when open', async () => {
    expect(el.shadowRoot?.querySelector('.edit-form')).to.exist;
  });

  it('does not render when closed', async () => {
    const closedEl = await fixture<MealEditDialog>(html`
      <meal-edit-dialog .open=${false}></meal-edit-dialog>
    `);
    expect(closedEl.shadowRoot?.querySelector('.edit-form')).to.not.exist;
  });

  it('does not render without profile', async () => {
    const noProfileEl = await fixture<MealEditDialog>(html`
      <meal-edit-dialog .open=${true}></meal-edit-dialog>
    `);
    expect(noProfileEl.shadowRoot?.querySelector('.edit-form')).to.not.exist;
  });

  it('initializes formData from meal prop', async () => {
    expect(el['formData']).to.deep.equal(mockMeal);
  });

  it('updates formData when meal prop changes', async () => {
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

  it('renders time input with formatted value', () => {
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    expect(timeInput).to.exist;
    expect(timeInput.value).toBe('08:30');
  });

  it('handles time input changes', async () => {
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    timeInput.value = '12:45';
    timeInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el['formData'].hour).toBe(12);
    expect(el['formData'].minute).toBe(45);
  });

  it('renders portion field when included in profile', () => {
    const portionInput = el.shadowRoot?.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    expect(portionInput).to.exist;
    expect(portionInput.value).toBe('2');
  });

  it('does not render portion field when not in profile', async () => {
    const noPortionProfile = { ...mockProfile, fields: [ProfileField.DAYS] };
    const noPortionEl = await fixture<MealEditDialog>(html`
      <meal-edit-dialog
        .open=${true}
        .profile=${noPortionProfile}
        .meal=${mockMeal}
      ></meal-edit-dialog>
    `);
    expect(noPortionEl.shadowRoot?.querySelector('#edit-portion')).to.not.exist;
  });

  it('handles portion input changes', async () => {
    const portionInput = el.shadowRoot?.querySelector(
      '#edit-portion',
    ) as HTMLInputElement;
    portionInput.value = '5';
    portionInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el['formData'].portion).toBe(5);
  });

  it('renders days selector when included in profile', () => {
    const daysContainer = el.shadowRoot?.querySelector('.days-row');
    expect(daysContainer).to.exist;
  });

  it('does not render days selector when not in profile', async () => {
    const noDaysProfile = { ...mockProfile, fields: [ProfileField.PORTION] };
    const noDaysEl = await fixture<MealEditDialog>(html`
      <meal-edit-dialog
        .open=${true}
        .profile=${noDaysProfile}
        .meal=${mockMeal}
      ></meal-edit-dialog>
    `);
    expect(noDaysEl.shadowRoot?.querySelector('.days-row')).to.not.exist;
  });

  it('renders predefined time buttons', () => {
    const buttons = el.shadowRoot?.querySelectorAll(
      '.edit-predefined-times ha-button',
    );
    expect(buttons?.length).to.be.greaterThan(0);
  });

  it('handles predefined time button click', async () => {
    const buttons = el.shadowRoot?.querySelectorAll(
      '.edit-predefined-times ha-button',
    );
    const button = buttons?.[0] as HTMLElement;
    button.click();
    await el.updateComplete;

    // First predefined time is 06:00
    expect(el['formData'].hour).toBe(6);
    expect(el['formData'].minute).toBe(0);
  });

  it('dispatches save event with formData', async () => {
    const saveSpy = vi.fn();
    el.addEventListener('save', saveSpy);

    el.handleSave();
    await el.updateComplete;

    expect(saveSpy).toHaveBeenCalledOnce();
    expect(saveSpy.mock.calls[0][0].detail).to.deep.equal(el['formData']);
  });

  it('dispatches cancel event', async () => {
    const cancelSpy = vi.fn();
    el.addEventListener('cancel', cancelSpy);

    el['handleCancel']();
    await el.updateComplete;

    expect(cancelSpy).toHaveBeenCalledOnce();
  });

  it('renders error message when error prop is set', async () => {
    el.error = 'Test error message';
    await el.updateComplete;

    const errorDiv = el.shadowRoot?.querySelector('.error');
    expect(errorDiv?.textContent).toBe('Test error message');
  });

  it('does not render error when error is null', () => {
    el.error = null;
    const errorDiv = el.shadowRoot?.querySelector('.error');
    expect(errorDiv).to.not.exist;
  });

  it('prevents form submission', async () => {
    const form = el.shadowRoot?.querySelector('form');
    const submitEvent = new Event('submit', { cancelable: true });
    form?.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it('updates formData via handleUpdate method', async () => {
    el['handleUpdate']({ hour: 15, minute: 30 });
    await el.updateComplete;

    expect(el['formData'].hour).toBe(15);
    expect(el['formData'].minute).toBe(30);
    expect(el['formData'].portion).toBe(2); // Unchanged
  });

  it('handles day changes from day selector', async () => {
    const newDays = 31; // Mon-Fri
    el['handleUpdate']({ days: newDays });
    await el.updateComplete;

    expect(el['formData'].days).toBe(newDays);
  });

  it('handles time with leading zeros', async () => {
    const timeInput = el.shadowRoot?.querySelector(
      '#edit-time',
    ) as HTMLInputElement;
    timeInput.value = '06:05';
    timeInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el['formData'].hour).toBe(6);
    expect(el['formData'].minute).toBe(5);
  });

  it('preserves existing formData when updating single field', async () => {
    const original = { ...el['formData'] };
    el['handlePortionInput']({ target: { value: '10' } } as any);
    await el.updateComplete;

    expect(el['formData'].portion).toBe(10);
    expect(el['formData'].hour).toBe(original.hour);
    expect(el['formData'].minute).toBe(original.minute);
    expect(el['formData'].days).toBe(original.days);
  });
});

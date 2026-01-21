/**
 * EditDialog component for editing feeding times
 * Self-contained LitElement component with form validation
 */

import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { renderDaySelector } from './day-selector';
import { localize } from '../locales/localize';
import { ProfileField, type FeedingTime, type DeviceProfile } from '../types';
import { SaveEvent } from '../constants';
import { formatTime, getProfilePortionCount, hasProfileField } from '../utils';

/**
 * Validate that hour and minute are valid time values
 */
function isValidTime(hour?: number, minute?: number): boolean {
  return (
    typeof hour === 'number' &&
    !isNaN(hour) &&
    typeof minute === 'number' &&
    !isNaN(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

/**
 * Format hour and minute as HH:MM string
 */
function formatHourMinute(hour?: number, minute?: number): string {
  if (!isValidTime(hour, minute)) return '--:--';
  return formatTime(hour, minute);
}

// Static list of predefined feeding times
const PREDEFINED_TIMES = ['06:00', '08:00', '12:00', '18:00', '21:00'];

/**
 * Meal edit dialog component
 * Emits: 'save' with FeedingTime detail, 'cancel' with no detail
 */
@customElement('meal-edit-dialog')
export class MealEditDialog extends LitElement {
  @property({ type: Object }) meal?: FeedingTime;
  @property({ type: Number }) index?: number;
  @property({ type: Object }) profile?: DeviceProfile;
  @property({ type: Boolean }) open = false;

  @state() private formData: Partial<FeedingTime> = {};

  static styles = css`
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 0.75em;
      width: 100%;
      box-sizing: border-box;
    }
    .edit-form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4em;
    }
    .edit-predefined-times {
      display: flex;
      gap: 0.4em;
      flex-wrap: wrap;
    }
    .edit-predefined-times ha-button {
      flex: 1 1 auto;
      min-width: 60px;
      max-width: calc(25% - 0.3em);
    }
    @media (max-width: 768px) {
      .edit-predefined-times ha-button {
        flex: 1 1 auto;
        min-width: 50px;
        max-width: calc(33.333% - 0.3em);
        font-size: 0.85em;
        --ha-button-height: 28px;
      }
    }
    label {
      font-weight: 500;
      font-size: 0.95em;
    }
    input[type='time'],
    input[type='number'] {
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      font-size: 1em;
      width: 100%;
      box-sizing: border-box;
    }
    .edit-mode .days-row {
      justify-content: center;
      margin: 0 auto;
      gap: 6px;
    }
    .edit-mode .day-cell {
      width: 2.4em;
      height: 2.4em;
      line-height: 2.4em;
      font-size: 1.15em;
      margin: 0 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  updated(changedProperties: PropertyValues) {
    if (
      (changedProperties.has('meal') || changedProperties.has('profile')) &&
      this.meal
    ) {
      const normalized: Partial<FeedingTime> = { ...this.meal };
      if (hasProfileField(this.profile, ProfileField.PORTION)) {
        const portionCount = getProfilePortionCount(this.profile);
        const portions = this.normalizePortions(normalized, portionCount);
        for (let i = 0; i < portionCount; i++) {
          if (portions[i] === undefined) {
            portions[i] = 1;
          }
        }
        normalized.portions = portions;
      }
      this.formData = normalized;
    }
  }

  private handleUpdate(update: Partial<FeedingTime>) {
    this.formData = { ...this.formData, ...update };
  }

  private handleTimeInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    const [h, m] = val.split(':').map(Number);
    this.handleUpdate({ hour: h, minute: m });
  }

  private handlePortionInput(index: number, e: Event) {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    const portions = Array.isArray(this.formData.portions)
      ? [...this.formData.portions]
      : [];
    portions[index] = value;
    this.handleUpdate({ portions });
  }

  private handlePredefinedTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    this.handleUpdate({ hour: h, minute: m });
  }

  handleSave() {
    // Validate and dispatch error event if validation fails
    if (!this.validate(this.formData)) {
      return;
    }

    this.dispatchEvent(
      new SaveEvent({ meal: this.formData as FeedingTime, index: this.index }),
    );
  }

  private validate(entry: Partial<FeedingTime>): boolean {
    if (!isValidTime(entry.hour, entry.minute)) {
      console.warn('Invalid time:', entry.hour, entry.minute);
      return false;
    }
    if (hasProfileField(this.profile, ProfileField.PORTION)) {
      const portionCount = getProfilePortionCount(this.profile);
      const portions = this.normalizePortions(entry, portionCount);
      for (let i = 0; i < portionCount; i++) {
        const value = portions[i];
        if (!value || value < 1) {
          console.warn('Invalid portion:', value);
          return false;
        }
      }
    }
    return true;
  }

  private normalizePortions(
    entry: Partial<FeedingTime>,
    portionCount: number,
  ): number[] {
    const portions = Array.isArray(entry.portions) ? [...entry.portions] : [];
    if (portions.length < portionCount) {
      portions.length = portionCount;
    }
    return portions;
  }

  private renderDaysField() {
    if (!hasProfileField(this.profile, ProfileField.DAYS)) return '';

    return renderDaySelector({
      days: this.formData?.days ?? 0,
      editable: true,
      onDaysChanged: (newDays: number) => this.handleUpdate({ days: newDays }),
    });
  }

  private renderPortionFields() {
    if (!hasProfileField(this.profile, ProfileField.PORTION)) return '';
    const portionCount = getProfilePortionCount(this.profile);
    const label = localize('common.portion');
    const useNumberedLabels = portionCount > 1;

    return html`
      ${Array.from({ length: portionCount }, (_, index) => {
        const value = Array.isArray(this.formData.portions)
          ? this.formData.portions[index]
          : undefined;
        return html`
          <div class="edit-form-group">
            <label for="edit-portion-${index}">
              ${useNumberedLabels ? `${label} ${index + 1}` : label}
            </label>
            <input
              id="edit-portion-${index}"
              type="number"
              min="1"
              .value=${String(value ?? 1)}
              @input=${(e: Event) => this.handlePortionInput(index, e)}
            />
          </div>
        `;
      })}
    `;
  }

  private renderPredefinedTimes() {
    return html`
      <div class="edit-predefined-times">
        ${PREDEFINED_TIMES.map(
          (time) => html`
            <ha-button
              type="button"
              @click=${() => this.handlePredefinedTime(time)}
            >
              ${time}
            </ha-button>
          `,
        )}
      </div>
    `;
  }

  render() {
    if (!this.open || !this.profile) {
      return html``;
    }

    return html`
      <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
        ${this.renderDaysField()}
        <div class="edit-form-group">
          <label for="edit-time">${localize('common.time')}</label>
          <input
            id="edit-time"
            class="edit-time"
            type="time"
            .value=${formatHourMinute(this.formData.hour, this.formData.minute)}
            @input=${this.handleTimeInput}
          />
        </div>
        ${this.renderPortionFields()} ${this.renderPredefinedTimes()}
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-edit-dialog': MealEditDialog;
  }
}

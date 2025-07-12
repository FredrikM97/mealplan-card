import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  decodeMealPlanData,
  encodeMealPlanData,
} from "./util/mealplan-state.js";
import type { FeedingTime } from "./util/mealplan-state.js";
import { loadHaComponents } from "@kipk/load-ha-components";
import { localize, setLanguage } from "./locales/localize";

import { renderScheduleView } from "./views/scheduleView";
import { renderOverview } from "./views/overview";
import { resolveProfile } from "./profiles/resolveProfile";
import type { DeviceProfileGroup } from "./profiles/types";

/**
 * MealPlan Card
 */
@customElement("mealplan-card")
export class MealPlanCard extends LitElement {

  private _hasUnsavedChanges(): boolean {
    if (!this._meals?.length) return false;
    return JSON.stringify(this._meals) !== JSON.stringify(this._persistedMeals);
  }

  private _setMealsFromDecoded(meals: FeedingTime[] | undefined | null) {
    const arr = Array.isArray(meals) ? meals : [];
    this._persistedMeals = arr;
    this._meals = arr;
  }
  private _hass;
  @property({ type: Object })
  get hass() {
    return this._hass;
  }
  set hass(val) {
    const old = this._hass;
    this._hass = val;
    this._updateHass();
    this.requestUpdate("hass", old);
  }
  @property({ type: Object }) accessor config;
  @state() accessor _meals: FeedingTime[];
  @state() accessor _persistedMeals: FeedingTime[];
  @state() accessor _dialogOpen: boolean = false;
  @state() accessor _editDialogOpen: boolean = false;
  @state() accessor _editForm: any = null;
  @state() accessor _editError: string | null = null;

  @property({ type: Boolean }) private _haComponentsReady = false;
  @state() private _decodeError: string | null = null;

  private resetEditState() {
    this._editDialogOpen = false;
    this._editForm = null;
    this._editError = null;
  }

  constructor() {
    super();
    this._meals = [];
    this._persistedMeals = [];
    this._dialogOpen = false;
  }

  static styles = [
    css`
      .overview-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin: 0 16px 8px 16px;
        box-sizing: border-box;
        padding-right: 8px;
      }
      @media (max-width: 600px) {
        .overview-row {
          flex-direction: column;
          gap: 4px;
          margin: 0 4px 8px 4px;
        }
      }
    `,
  ];

  setConfig(config) {
    this.config = config;
  }

  async connectedCallback() {
    await setLanguage(this.hass.language); // Only loads once, even if called multiple times
    await loadHaComponents(["ha-button", "ha-data-table", "ha-dialog"]);
    this._haComponentsReady = true;
    super.connectedCallback();
  }

  get _sensorID() {
    return this.config?.sensor;
  }
  get _helperID() {
    return this.config?.helper;
  }

  get _name() {
    const stateObj = this.hass?.states?.[this._sensorID];
    return stateObj?.attributes?.friendly_name || this._sensorID;
  }

  /**
   * Main update logic: determines source, decodes, and syncs helper if needed.
   */
  _updateHass() {
    if (this._hasUnsavedChanges()) return;

    const profile = resolveProfile(this.config || {});
    if (!profile || !Array.isArray(profile.encodingFields) || profile.encodingFields.length === 0) {
      this._decodeError = "Selected feeder profile is invalid or not supported.";
      this._setMealsFromDecoded([]);
      return;
    }

    // Use getters for IDs, and inline the rest for clarity
    const stateObj = this.hass?.states?.[this._sensorID];
    const helperObj = this.hass?.states?.[this._helperID];
    const sensorRaw = stateObj?.state ?? "";
    const helperRaw = helperObj?.state ?? "";

    // Prefer sensor if valid
    const isValid = (v: any) => typeof v === "string" && v.trim() !== "" && v !== "unknown" && v !== "unavailable";


    // Helper for decode+set
    const tryDecodeAndSet = (raw: string) => {
      this._decodeError = null;
      try {
        const meals = decodeMealPlanData(raw, { encodingFields: profile.encodingFields });
        this._setMealsFromDecoded(meals);
        return true;
      } catch (err) {
        console.error("Meal plan decode error:", err);
        this._decodeError = (err as Error).message || "Failed to decode meal plan data.";
        this._setMealsFromDecoded([]);
        return false;
      }
    };
    
    if (
      isValid(sensorRaw) &&
      tryDecodeAndSet(sensorRaw) &&
      helperObj && isValid(helperRaw) && sensorRaw !== helperRaw
    ) {
      this._updateHelperIfOutOfSync(sensorRaw, helperRaw);
      return;
    }
    if (isValid(sensorRaw)) {
      tryDecodeAndSet(sensorRaw);
      return;
    }

    // Sensor not valid, try helper
    if (!isValid(sensorRaw) && helperObj && isValid(helperRaw)) {
      tryDecodeAndSet(helperRaw);
      return;
    }

    // Neither is valid
    this._decodeError = "No valid meal plan data found: neither helper nor a valid sensor value is present.";
    this._setMealsFromDecoded([]);
  }




  /** Syncs the helper if it's out of sync with the sensor. */
  private _updateHelperIfOutOfSync(sensorRaw: string, helperRaw: string) {
    if (this.config?.helper && this._helperID && this.hass && sensorRaw !== helperRaw) {
      this.hass.callService("input_text", "set_value", {
        entity_id: this._helperID,
        value: sensorRaw,
      });
    }
  }



  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    const profile = resolveProfile(this.config || {});
    return html`
      <ha-card
        header=${this.config?.title || "MealPlan Card"}
        style="height: 100%;"
      >
        ${this._decodeError
          ? html`<div style="color: var(--error-color, red); margin: 8px;">
              ${this._decodeError}
            </div>`
          : ""}
        ${renderOverview({
          meals: this._meals,
          localize,
        })}
        <div
          class="card-actions"
          style="display: flex; justify-content: flex-end; padding: 8px 16px 8px 16px; gap: 8px;"
        >
          <ha-button
            class="manage-btn"
            @click=${() => {
              this._dialogOpen = true;
            }}
          >
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${localize("manage_schedules")}
          </ha-button>
        </div>
        <slot></slot>
        ${this._dialogOpen
          ? renderScheduleView({
              profile,
              hass: this.hass,
              viewMeals: [...this._meals],
              editForm: this._editForm,
              editError: this._editError,
              editDialogOpen: this._editDialogOpen,
              onUpdateEditForm: (update) => {
                this._editForm = { ...this._editForm, ...update };
                this.requestUpdate();
              },
              onOpenEditDialog: (idx) => {
                this._editForm = { ...this._meals[idx], _idx: idx };
                this._editDialogOpen = true;
                this._editError = null;
                this.requestUpdate();
              },
              onOpenAddDialog: () => {
                this._editForm = {
                  hour: 12,
                  minute: 0,
                  portion: 1,
                  days: 127,
                  enabled: true,
                };
                this._editDialogOpen = true;
                this._editError = null;
                this.requestUpdate();
              },
              onCloseEditDialog: () => {
                this.resetEditState();
                this.requestUpdate();
              },
              onDelete: (idx) => {
                this._meals = this._meals.filter((_, i) => i !== idx);
                this.resetEditState();
                this.requestUpdate();
              },
              onCancel: () => {
                this._dialogOpen = false;
                this.resetEditState();
                this.requestUpdate();
              },
              onSave: () => {
                this._persistedMeals = JSON.parse(JSON.stringify(this._meals));
                this._dialogOpen = false;
                this.resetEditState();
                this._saveMealsToSensor();
                this.requestUpdate();
              },
              onEditSave: () => {
                if (!this._editForm) return;
                const idx = this._editForm._idx;
                if (idx !== undefined && idx !== null && idx >= 0) {
                  this._meals = this._meals.map((m, i) =>
                    i === idx ? { ...this._editForm } : m,
                  );
                } else {
                  this._meals = [...this._meals, { ...this._editForm }];
                }
                this._editDialogOpen = false;
                this._editForm = null;
                this._editError = null;
                this.requestUpdate();
              },
              onToggleEnabled: (idx, e) => {
                const target = e.target as HTMLInputElement | null;
                const checked =
                  target && typeof target.checked === "boolean"
                    ? target.checked
                    : false;
                this._meals = this._meals.map((m, i) =>
                  i === idx ? { ...m, enabled: checked ? 1 : 0 } : m,
                );
                this.requestUpdate();
              },
              hasUnsavedChanges:
                JSON.stringify(this._meals) !==
                JSON.stringify(this._persistedMeals),
            })
          : ""}
      </ha-card>
    `;
  }
  static async getConfigElement() {
    await import("./card-editor");
    return document.createElement("mealplan-card-editor");
  }

  /** Encodes and saves the current meals to the sensor. */
  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID) return;
    const profile = resolveProfile(this.config || {});
    if (!profile || !Array.isArray(profile.encodingFields) || profile.encodingFields.length === 0) return;
    const value = encodeMealPlanData(this._meals, {
      encodingFields: profile.encodingFields ?? [],
    });
    this.hass.callService("text", "set_value", {
      entity_id: this._sensorID,
      value,
    });
  }
  _onScheduleMealsChanged(e) {
    console.log("[MealPlanCard] _onScheduleMealsChanged called", e);
    this._meals = e.detail.meals;
    this._saveMealsToSensor();
  }
}

// Exported stub for test coverage
export function loadTranslations() {
  throw new Error("Function not implemented.");
}

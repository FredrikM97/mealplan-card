import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { commonCardStyle } from './common-styles.js';
import { loadHaComponents } from '@kipk/load-ha-components';

console.log('[cleverio-edit-view] Module loaded');

@customElement('cleverio-edit-view')
export class CleverioEditView extends LitElement {
  @property({ type: Object }) accessor data: any = { time: '', portion: 1, daysMask: 0 };
  @state() private _schema = [
    { name: 'time', selector: { time: {} } },
    { name: 'portion', selector: { number: { min: 1 } } },
  ];
  @state() private _haComponentsReady = false;

  static styles = [
    commonCardStyle,
    // language=css
    css`
      .day-btn.selected {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        font-weight: bold;
        border-radius: 16px;
        box-shadow: 0 0 0 2px var(--primary-color, #03a9f4) inset;
        border: 2px solid var(--primary-color, #03a9f4);
      }
      .day-btn {
        min-width: 2.5em;
        padding: 0 0.5em;
        font-weight: 500;
        border: 2px solid var(--divider-color, #bdbdbd);
        border-radius: 16px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #222);
        transition: border 0.2s, background 0.2s, color 0.2s;
      }
      .day-btn:not(.selected):hover {
        border: 2px solid var(--primary-color, #03a9f4);
        background: var(--primary-color, #e3f2fd);
        color: var(--primary-color, #03a9f4);
      }
      input[type="number"] {
        text-align: right;
      }
    `
  ];


  async connectedCallback() {
    super.connectedCallback();
    console.log('[cleverio-edit-view] connectedCallback');
    try {
      await loadHaComponents(['ha-form', 'ha-button', 'ha-switch']);
      this._haComponentsReady = true;
      this.requestUpdate();
      console.log('[cleverio-edit-view] HA components loaded');
      console.log('[cleverio-edit-view] ha-button defined:', !!customElements.get('ha-button'));
      console.log('[cleverio-edit-view] ha-form defined:', !!customElements.get('ha-form'));
      console.log('[cleverio-edit-view] ha-switch defined:', !!customElements.get('ha-switch'));
    } catch (err) {
      console.error('[cleverio-edit-view] Error loading HA components', err);
    }
  }

  render() {
    console.log('[cleverio-edit-view] render', { _haComponentsReady: this._haComponentsReady, data: this.data });
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    return html`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title">Edit Meal</h3>
        <div style="display:flex; gap:0.5em; margin-bottom:0.5em; flex-wrap:wrap;">
          ${['Mo','Tu','We','Th','Fr','Sa','Su'].map((day, i) => html`
            <ha-button
              outlined
              class="day-btn${this.data.daysMask & (1 << i) ? ' selected' : ''}"
              @click=${(e: Event) => this._toggleDay(e, i)}
              style="min-width:2.5em; padding:0 0.5em;"
            >${day}</ha-button>
          `)}
        </div>
        <div style="margin-bottom:0.5em; display:flex; flex-direction:column; gap:0.5em;">
          <label for="time-input">Time:</label>
          <input id="time-input" type="time" .value=${this.data.time} @input=${(e: Event) => this._onTimeInput(e)} required style="max-width: 120px;" />
        </div>
        <div style="margin-bottom:0.5em; display:flex; flex-direction:column; gap:0.5em;">
          <label for="portion-input">Portion:</label>
          <input id="portion-input" type="number" min="1" .value=${this.data.portion} @input=${(e: Event) => this._onPortionInput(e)} required style="max-width: 80px;" />
        </div>
        <div style="display:flex; gap:0.5em; margin: 1em 0;">
          ${['07:00','12:00','18:00'].map((t: string) => html`<ha-button outlined @click=${(e: Event) => this._suggestTime(e, t)}>${t}</ha-button>`)}
        </div>
        <div style="display:flex; gap:1em; justify-content:flex-end;">
          <ha-button @click=${this._onBack}>Back</ha-button>
          <ha-button type="submit">Save</ha-button>
        </div>
      </form>
    `;
  }

  private _toggleDay(e: Event, i: number) {
    e.preventDefault();
    this.data = { ...this.data, daysMask: this.data.daysMask ^ (1 << i) };
    this.requestUpdate();
    console.log('[cleverio-edit-view] _toggleDay', { i, daysMask: this.data.daysMask });
  }
  private _suggestTime(e: Event, t: string) {
    e.preventDefault();
    this.data = { ...this.data, time: t };
    this.requestUpdate();
    console.log('[cleverio-edit-view] _suggestTime', { t });
  }
  private _onFormValueChanged(e: CustomEvent) {
    this.data = { ...this.data, ...e.detail.value };
    this.requestUpdate();
    console.log('[cleverio-edit-view] _onFormValueChanged', { value: e.detail.value });
  }
  private _onBack(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
    console.log('[cleverio-edit-view] _onBack');
  }
  private _onSave(e: Event) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('save', { detail: { meal: this.data }, bubbles: true, composed: true }));
    console.log('[cleverio-edit-view] _onSave', { meal: this.data });
  }
  private _onTimeInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.data = { ...this.data, time: input.value };
    this.requestUpdate();
    console.log('[cleverio-edit-view] _onTimeInput', { value: input.value });
  }
  private _onPortionInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.data = { ...this.data, portion: parseInt(input.value, 10) };
    this.requestUpdate();
    console.log('[cleverio-edit-view] _onPortionInput', { value: input.value });
  }
}

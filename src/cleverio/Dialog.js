import { LitElement, html, css } from 'lit';
import './Schedules.js';
import './Edit.js';

/**
 * Props:
 *   - view: 'schedules' | 'edit'
 *   - data: any (optional, e.g. meal to edit)
 *   - meals: array (for schedules)
 * Events:
 *   - close-dialog
 *   - save-schedules
 */
export class CleverioDialog extends LitElement {
  static properties = {
    view: { type: String },
    data: { type: Object },
    meals: { type: Array },
  };

  static styles = [
    css`
      ha-dialog.cleverio-dialog {
        max-width: 420px;
        min-width: 280px;
        width: 100%;
        margin: 0;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: var(--ha-card-border-width, 1.5px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.08));
        overflow: hidden;
      }
    `
  ];

  render() {
    return html`
      <ha-dialog
        class="cleverio-dialog"
        open
        scrimClickAction
        @closed=${this._onClose}
        @keydown=${this._onKeyDown}
      >
        ${this.view === 'schedules' ? html`
          <cleverio-schedules-view
            .meals=${this.meals}
            @close-dialog=${this._onClose}
            @save=${this._onSaveSchedules}
          ></cleverio-schedules-view>
        ` : this.view === 'edit' ? html`
          <cleverio-edit-view
            .meal=${this.data?.meal}
            @back=${this._onClose}
            @save=${this._onEditSave}
          ></cleverio-edit-view>
        ` : ''}
      </ha-dialog>
    `;
  }

  _onClose = () => {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  };

  _onSaveSchedules = (e) => {
    this.dispatchEvent(new CustomEvent('save-schedules', { detail: e.detail, bubbles: true, composed: true }));
  };

  _onEditSave = (e) => {
    // For future extensibility: could dispatch a save-edit event
    this._onClose();
  };

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      this._onClose();
    }
  }
}

customElements.define('cleverio-dialog', CleverioDialog);

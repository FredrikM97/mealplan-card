import { LitElement, html, css } from 'lit';

class CleverioPF100CardEditor extends LitElement {
  static properties = {
    config: { type: Object },
  };

  setConfig(config) {
    this.config = { ...config };
  }

  getConfig() {
    return this.config;
  }

  _onInput(e) {
    const field = e.target.name;
    this.config = { ...this.config, [field]: e.target.value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }

  render() {
    return html`
      <div>
        <label>Title
          <input name="title" .value=${this.config?.title || ''} @input=${this._onInput} />
        </label>
        <label>Sensor entity
          <input name="sensor" .value=${this.config?.sensor || ''} @input=${this._onInput} />
        </label>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; padding: 8px; }
    label { display: flex; flex-direction: column; margin-bottom: 12px; }
    input { padding: 4px 8px; font-size: 1em; }
  `;
}

customElements.define('cleverio-pf100-card-editor', CleverioPF100CardEditor);

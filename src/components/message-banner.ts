import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property } from 'lit/decorators.js';

/**
 * Generic message banner component, themed with Home Assistant CSS variables.
 * Types: "info" | "success" | "warning" | "error"
 */
@customElement('message-banner')
export class MessageBanner extends LitElement {
  @property({ type: String }) type: 'info' | 'success' | 'warning' | 'error' =
    'info';
  @property({ type: String }) title: string = '';
  @property({ type: String }) message: string = '';
  @property({ type: String }) icon: string = '';

  static styles = css`
    .banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--card-background-color);
      border-left: 4px solid var(--divider-color);
      margin: 8px 0 16px;
    }
    /* Emphasize type via border color + subtle background tint */
    .banner.warning {
      border-left-color: var(--warning-color);
      background-color: var(--warning-bg-color, rgba(255, 152, 0, 0.12));
    }
    .banner.info {
      border-left-color: var(--info-color);
      background-color: var(--info-bg-color, rgba(0, 123, 255, 0.1));
    }
    .banner.error {
      border-left-color: var(--error-color);
      background-color: var(--error-bg-color, rgba(244, 67, 54, 0.12));
    }
    .banner.success {
      border-left-color: var(--success-color);
      background-color: var(--success-bg-color, rgba(76, 175, 80, 0.12));
    }
    .content {
      flex: 1;
    }
    .title {
      font-weight: 600;
      margin-bottom: 4px;
      /* inherit text color from theme */
    }
    .text {
      font-size: 0.95em;
      /* inherit secondary text color from theme */
    }
    ha-icon {
      --mdc-icon-size: 24px;
      margin-top: 2px;
      flex-shrink: 0;
    }
  `;

  private getIcon(): string {
    if (this.icon) return this.icon;
    switch (this.type) {
      case 'warning':
        return 'mdi:alert';
      case 'error':
        return 'mdi:alert-circle';
      case 'success':
        return 'mdi:check-circle';
      default:
        return 'mdi:information';
    }
  }

  render() {
    return html`
      <div
        class=${classMap({ banner: true, [this.type]: true })}
        role="alert"
        aria-live="polite"
      >
        <ha-icon .icon=${this.getIcon()}></ha-icon>
        <div class="content">
          ${this.title ? html`<div class="title">${this.title}</div>` : ''}
          <div class="text">${this.message}</div>
        </div>
      </div>
    `;
  }
}

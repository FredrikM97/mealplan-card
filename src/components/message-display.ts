/**
 * Message display component - listens for meal-message events
 * Self-contained message handling with auto-dismiss
 */

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  EVENT_MEAL_MESSAGE,
  EVENT_CLEAR_MESSAGE,
  MESSAGE_TYPE_INFO,
  MESSAGE_TYPE_ERROR,
  type MessageType,
} from '../constants.js';

@customElement('meal-message-display')
export class MealMessageDisplay extends LitElement {
  @state() private message: string | null = null;
  @state() private messageType: MessageType = MESSAGE_TYPE_INFO;
  private dismissTimeout?: ReturnType<typeof setTimeout>;

  static styles = css`
    :host {
      display: block;
    }

    .message {
      padding: 12px 16px;
      margin: 8px 16px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideIn 0.3s ease-out;
    }

    .message.error {
      color: var(--error-color, #db4437);
      background: var(--error-background-color, rgba(219, 68, 55, 0.1));
      border-left: 4px solid var(--error-color, #db4437);
    }

    .message.info {
      color: var(--secondary-text-color, #666);
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.1));
      border-left: 4px solid var(--secondary-text-color, #666);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-icon {
      flex-shrink: 0;
    }

    .message-text {
      flex: 1;
    }

    .dismiss-button {
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .dismiss-button:hover {
      opacity: 1;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(EVENT_MEAL_MESSAGE, this.handleMessageEvent, true);
    window.addEventListener(EVENT_CLEAR_MESSAGE, this.handleClearEvent, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      EVENT_MEAL_MESSAGE,
      this.handleMessageEvent,
      true,
    );
    window.removeEventListener(
      EVENT_CLEAR_MESSAGE,
      this.handleClearEvent,
      true,
    );
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
  }

  private handleMessageEvent = (e: Event) => {
    if (e instanceof CustomEvent) {
      this.showMessage(e.detail.message, e.detail.type);
    }
  };

  private handleClearEvent = () => {
    this.clearMessage();
  };

  private showMessage(message: string, type: MessageType = MESSAGE_TYPE_INFO) {
    this.message = message;
    this.messageType = type;

    // Auto-dismiss after 10 seconds
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
    this.dismissTimeout = setTimeout(() => this.clearMessage(), 10000);
  }

  private clearMessage() {
    this.message = null;
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
    }
  }

  private handleDismiss() {
    this.clearMessage();
  }

  render() {
    if (!this.message) {
      return html``;
    }

    const icon =
      this.messageType === MESSAGE_TYPE_ERROR
        ? 'mdi:alert-circle'
        : 'mdi:information-outline';

    return html`
      <div class="message ${this.messageType}">
        <ha-icon class="message-icon" icon="${icon}"></ha-icon>
        <div class="message-text">${this.message}</div>
        <ha-icon
          class="dismiss-button"
          icon="mdi:close"
          @click=${this.handleDismiss}
        ></ha-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-message-display': MealMessageDisplay;
  }
}

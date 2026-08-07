import { LitElement, html, css } from 'lit';
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js';

export type DialogActionSlot = 'primaryAction' | 'secondaryAction';

export interface DialogAction {
  id: string;
  label: string;
  slot: DialogActionSlot;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
}

@customElement('meal-dialog-actions')
export class MealDialogActions extends LitElement {
  @property({ attribute: false }) actions: DialogAction[] = [];
  @property({ type: Boolean }) inline = false;

  static styles = css`
    .inline-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 16px;
      border-top: 1px solid var(--divider-color);
      box-sizing: border-box;
    }

    .inline-actions [slot='secondaryAction'] {
      margin-right: auto;
    }

    .destructive-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--error-color, #b00020);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 8px 4px;
      font-family: inherit;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 4px;
    }
    .destructive-btn:hover {
      background-color: rgba(var(--rgb-error-color, 176, 0, 32), 0.08);
    }
  `;

  private emitAction(id: string) {
    this.dispatchEvent(
      new CustomEvent('action', {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private renderButtons() {
    return this.actions.map((action) => {
      if (action.destructive) {
        return html`
          <button
            slot=${action.slot}
            class="destructive-btn"
            @click=${() => this.emitAction(action.id)}
          >
            ${action.label}
          </button>
        `;
      }
      return html`
        <ha-button
          slot=${action.slot}
          ?disabled=${!!action.disabled}
          @click=${() => this.emitAction(action.id)}
        >
          ${
            action.icon
              ? html`<ha-icon .icon=${action.icon} slot="icon"></ha-icon>`
              : ''
          }
          ${action.label}
        </ha-button>
      `;
    });
  }

  render() {
    if (this.inline) {
      return html`<div class="inline-actions">${this.renderButtons()}</div>`;
    }

    return html`<ha-dialog-footer>${this.renderButtons()}</ha-dialog-footer>`;
  }
}

type DialogActionOwner = HTMLElement & {
  footerActions?: DialogAction[];
};

/**
 * Reusable HA dialog shell to standardize layout and event forwarding.
 */
@customElement('meal-dialog-shell')
export class MealDialogShell extends LitElement {
  @property({ type: Boolean }) open = true;
  @property({ type: String }) headerTitle = '';
  @property({ attribute: false }) actions: DialogAction[] = [];
  @queryAssignedElements({ flatten: true })
  private assignedChildren!: HTMLElement[];

  private readonly onFooterActionsChanged = () => {
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(
      'footer-actions-changed',
      this.onFooterActionsChanged,
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      'footer-actions-changed',
      this.onFooterActionsChanged,
    );
    super.disconnectedCallback();
  }

  private getActionOwner(): DialogActionOwner | null {
    for (const child of this.assignedChildren) {
      const owner = child as DialogActionOwner;
      if (Array.isArray(owner.footerActions)) {
        return owner;
      }
    }
    return null;
  }

  public show(options?: {
    headerTitle?: string;
    actions?: DialogAction[];
  }): void {
    if (options?.headerTitle !== undefined) {
      this.headerTitle = options.headerTitle;
    }
    if (options?.actions !== undefined) {
      this.actions = options.actions;
    }
    this.open = true;
  }

  public hide(): void {
    this.open = false;
  }

  public setHeaderTitle(title: string): void {
    this.headerTitle = title;
  }

  public setActions(actions: DialogAction[]): void {
    this.actions = actions;
  }

  private getResolvedActions(): DialogAction[] {
    const ownedActions = this.getActionOwner()?.footerActions;
    if (ownedActions) {
      return ownedActions;
    }

    return this.actions;
  }

  private handleClosed(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('closed', {
        detail: undefined,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitAction(id: string) {
    const owner = this.getActionOwner();
    if (owner) {
      owner.dispatchEvent(
        new CustomEvent('footer-action', {
          detail: { id },
          bubbles: false,
          composed: false,
        }),
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent('footer-action', {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleSlotChange() {
    this.requestUpdate();
  }

  render() {
    return html`
      <ha-dialog
        ?open=${this.open}
        header-title=${this.headerTitle}
        @closed=${this.handleClosed}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <meal-dialog-actions
          slot="footer"
          .actions=${this.getResolvedActions()}
          @action=${(e: CustomEvent<{ id: string }>) =>
            this.emitAction(e.detail.id)}
        ></meal-dialog-actions>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-dialog-actions': MealDialogActions;
    'meal-dialog-shell': MealDialogShell;
  }
}

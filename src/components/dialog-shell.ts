import { LitElement, html } from 'lit';
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
  onClick?: () => void;
}

type DialogActionOwner = HTMLElement & {
  getFooterActions?: () => DialogAction[];
  handleFooterAction?: (id: string) => void;
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

  private getActionOwner(): DialogActionOwner | null {
    for (const child of this.assignedChildren) {
      const owner = child as DialogActionOwner;
      if (typeof owner.getFooterActions === 'function') {
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
    const ownedActions = this.getActionOwner()?.getFooterActions?.();
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
    if (owner?.handleFooterAction) {
      owner.handleFooterAction(id);
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
        <ha-dialog-footer slot="footer">
          ${this.getResolvedActions().map(
            (action) => html`
              <ha-button
                slot=${action.slot}
                ?disabled=${!!action.disabled}
                @click=${() => {
                  if (action.onClick) {
                    action.onClick();
                    return;
                  }
                  this.emitAction(action.id);
                }}
              >
                ${
                  action.icon
                    ? html`<ha-icon .icon=${action.icon} slot="icon"></ha-icon>`
                    : ''
                }
                ${action.label}
              </ha-button>
            `,
          )}
        </ha-dialog-footer>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-dialog-shell': MealDialogShell;
  }
}

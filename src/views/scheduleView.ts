import { html } from "lit";
import { renderDaySelector } from "../day-selector";
import { localize } from "../locales/localize";
import "../day-selector";
import { renderEditView } from "./editView";
import { formatHourMinute } from "../util/days-util";

export function renderScheduleView({
  profile,
  hass,
  viewMeals,
  editForm,
  editError,
  editDialogOpen,
  onUpdateEditForm,
  onOpenEditDialog,
  onOpenAddDialog,
  onCloseEditDialog,
  onDelete,
  onCancel,
  onSave,
  onEditSave,
  onToggleEnabled,
  hasUnsavedChanges,
}: {
  profile: any;
  hass: any;
  viewMeals: any[];
  editForm: any;
  editError: string | null;
  editDialogOpen: boolean;
  onUpdateEditForm: (update: Partial<any>) => void;
  onOpenEditDialog: (idx: number) => void;
  onOpenAddDialog: () => void;
  onCloseEditDialog: () => void;
  onDelete: (idx: number) => void;
  onCancel: () => void;
  onSave: () => void;
  onEditSave: (e?: Event) => void;
  onToggleEnabled: (idx: number, e: Event) => void;
  hasUnsavedChanges: boolean;
}) {
  const fields = profile.fields || [];
  const buildColumns = (profile: any) => {
    const columns: any = {};
    columns.time = {
      title: localize("time"),
      sortable: true,
      minWidth: "80px",
      valueColumn: "hourMinute",
      template: (row: any) => formatHourMinute(row.hour, row.minute),
    };
    if (fields.includes("portion")) {
      columns.portion = {
        title: localize("portion"),
        sortable: true,
        minWidth: "80px",
      };
    }
    if (fields.includes("days")) {
      columns.days = {
        title: localize("days"),
        sortable: false,
        minWidth: "130px",
        template: (row: any) =>
          renderDaySelector({
            days: row.days,
            editable: false,
            firstDay: profile.firstDay,
          }),
      };
    }
    if (fields.includes("enabled")) {
      columns.enabled = {
        title: localize("enabled"),
        sortable: true,
        minWidth: "60px",
        template: (row: any) => html`
          <div
            style="display: flex; align-items: center; justify-content: center; height: 48px;"
          >
            <ha-switch
              .checked=${!!row.enabled}
              @change=${(e: Event) => onToggleEnabled(row._idx, e)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `,
      };
    }
    columns.actions = {
      title: localize("actions"),
      sortable: false,
      minWidth: "140px",
      template: (row: any) => html`
        <ha-icon-button @click=${() => onOpenEditDialog(row._idx)} title="Edit">
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        ${fields.includes("delete")
          ? html`
              <ha-icon-button @click=${() => onDelete(row._idx)} title="Delete">
                <ha-icon icon="mdi:delete"></ha-icon>
              </ha-icon-button>
            `
          : ""}
      `,
    };
    return columns;
  };
  const buildRows = () =>
    viewMeals.map((m, i) => ({
      ...m,
      _idx: i,
      hourMinute: m.hour * 60 + m.minute,
    }));
  const columns = buildColumns(profile);
  const rows = buildRows();
  return html`
    <style>
      ha-dialog {
        min-width: unset !important;
        width: 100vw !important;
        max-width: 100vw !important;
        box-sizing: border-box;
      }
      .schedule-table-wrapper {
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
      }
      .edit-mode .days-row {
        justify-content: center;
        margin: 0 auto;
        gap: 8px;
      }
      .edit-mode .day-cell {
        width: 2.6em;
        height: 2.6em;
        line-height: 2.6em;
        font-size: 1.25em;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
        box-sizing: border-box;
      }
      .edit-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      .edit-predefined-times {
        display: flex;
        gap: 0.5em;
        flex-wrap: wrap;
      }
      .edit-error {
        color: red;
        font-size: 0.9em;
      }
    </style>
    <ha-dialog
      open=${editDialogOpen}
      scrimClickAction
      heading=${editDialogOpen
        ? localize("edit_feeding_time")
        : localize("manage_schedules")}
    >
      ${editDialogOpen
        ? renderEditView({
            profile,
            editForm,
            editError,
            onUpdate: onUpdateEditForm,
          })
        : html`
            <div class="schedule-table-wrapper">
              <ha-data-table
                .localizeFunc=${localize}
                .columns=${columns}
                .hass=${hass}
                .data=${rows}
                class="schedule-table-style"
                auto-height
              ></ha-data-table>
            </div>
          `}
      ${editDialogOpen
        ? html`
            <ha-button slot="secondaryAction" @click=${onCloseEditDialog}
              >${localize("back")}</ha-button
            >
            <ha-button
              slot="primaryAction"
              class="ha-primary"
              @click=${onEditSave}
              >${localize("save")}</ha-button
            >
          `
        : html`
            ${fields.includes("add")
              ? html`<ha-button slot="secondaryAction" @click=${onOpenAddDialog}
                  >${localize("add_meal")}</ha-button
                >`
              : ""}
            <ha-button slot="secondaryAction" @click=${onCancel}
              >${localize("cancel")}</ha-button
            >
            <ha-button
              slot="primaryAction"
              class="ha-primary"
              @click=${onSave}
              ?disabled=${!hasUnsavedChanges}
              >${localize("save")}</ha-button
            >
          `}
    </ha-dialog>
  `;
}

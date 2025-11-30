import { render } from 'lit';
import { expect, describe, it, vi } from 'vitest';
import { renderScheduleView } from '../../src/views/scheduleView';
import { profiles } from '../../src/profiles/profiles';
const cleverioProfile = profiles.find((group) =>
  group.profiles.some((p) => p.manufacturer === 'Cleverio'),
)!;

class HaDataTableMock extends HTMLElement {
  _data: any;
  _columns: any;
  set data(val: any) {
    this._data = val;
  }
  get data() {
    return this._data;
  }
  set columns(val: any) {
    this._columns = val;
  }
  get columns() {
    return this._columns;
  }
}
if (!customElements.get('ha-data-table'))
  customElements.define('ha-data-table', HaDataTableMock);
if (!customElements.get('ha-button'))
  customElements.define('ha-button', class extends HTMLElement {});
if (!customElements.get('ha-chip'))
  customElements.define('ha-chip', class extends HTMLElement {});
if (!customElements.get('ha-icon-button'))
  customElements.define('ha-icon-button', class extends HTMLElement {});
if (!customElements.get('ha-icon'))
  customElements.define('ha-icon', class extends HTMLElement {});
if (!customElements.get('ha-switch'))
  customElements.define('ha-switch', class extends HTMLElement {});

const sampleMeals = [
  { hour: 8, minute: 0, portion: 2, daysMask: 127, enabled: 1 },
  { hour: 18, minute: 0, portion: 1, daysMask: 62, enabled: 0 },
];

describe('renderScheduleView (function)', () => {
  it('renders a ha-data-table with correct rows and columns', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(
      renderScheduleView({
        profile: cleverioProfile,
        hass: {},
        viewMeals: sampleMeals,
        editForm: null,
        editError: null,
        editDialogOpen: false,
        onUpdateEditForm: vi.fn(),
        onOpenEditDialog: vi.fn(),
        onOpenAddDialog: vi.fn(),
        onCloseEditDialog: vi.fn(),
        onDelete: vi.fn(),
        onCancel: vi.fn(),
        onSave: vi.fn(),
        onEditSave: vi.fn(),
        onToggleEnabled: vi.fn(),
        hasUnsavedChanges: false,
      }),
      container,
    );
    // Wait for rendering
    await new Promise((r) => setTimeout(r, 10));
    const tableWrapper = container.querySelector('.schedule-table-wrapper');
    expect(tableWrapper).to.exist;
    const dataTable =
      tableWrapper && tableWrapper.querySelector('ha-data-table');
    expect(dataTable).to.exist;
    // Cast to HaDataTableMock to access .data
    const dt = dataTable as any;
    expect(dt.data.length).to.equal(2);
    expect(dt.data[0].hour).to.equal(8);
    expect(dt.data[0].portion).to.equal(2);
    document.body.removeChild(container);
  });

  it('renders enabled toggle and delete buttons when fields include them', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onToggle = vi.fn();
    const onDel = vi.fn();

    render(
      renderScheduleView({
        profile: cleverioProfile,
        hass: {},
        viewMeals: sampleMeals,
        editForm: null,
        editError: null,
        editDialogOpen: false,
        onUpdateEditForm: vi.fn(),
        onOpenEditDialog: vi.fn(),
        onOpenAddDialog: vi.fn(),
        onCloseEditDialog: vi.fn(),
        onDelete: onDel,
        onCancel: vi.fn(),
        onSave: vi.fn(),
        onEditSave: vi.fn(),
        onToggleEnabled: onToggle,
        hasUnsavedChanges: false,
      }),
      container,
    );

    await new Promise((r) => setTimeout(r, 10));
    const dataTable = container.querySelector('ha-data-table') as any;
    expect(dataTable).to.exist;

    // Check that columns include enabled and actions
    const columns = dataTable.columns;
    expect(columns.enabled).to.exist;
    expect(columns.actions).to.exist;

    document.body.removeChild(container);
  });
});

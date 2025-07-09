import { beforeAll } from "vitest";

beforeAll(() => {
  globalThis.__DEMO__ = false;
  // Expanded list of HA and common custom elements used in tests/components
  const haElements = [
    "ha-card",
    "ha-card-header", // Add ha-card-header for tests
    "ha-button",
    "ha-textfield",
    "ha-switch",
    "ha-icon",
    "ha-select",
    "ha-checkbox",
    "ha-slider",
    "ha-list-item",
    "ha-formfield",
    "ha-radio",
    "ha-chip",
    "ha-alert",
    "ha-svg-icon",
    "ha-circular-progress",
    "edit-view",
  ];
  haElements.forEach((tag) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  });

  // Patch ha-data-table to render a minimal table for tests, using .data property and template functions
  if (!customElements.get("ha-data-table")) {
    class DummyDataTable extends HTMLElement {
      private _data: any[] = [];
      private _columns: Record<string, any> = {};
      static get observedAttributes() {
        return [];
      }
      set data(val) {
        this._data = val;
        this.render();
      }
      get data() {
        return this._data || [];
      }
      set columns(val) {
        this._columns = val;
        this.render();
      }
      get columns() {
        return this._columns || {};
      }
      connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.render();
      }
      render() {
        if (!this.shadowRoot) return;
        const cols = this.columns;
        const data = this.data;
        const colKeys = Object.keys(cols);
        // Clear shadowRoot
        this.shadowRoot.innerHTML = "";
        const table = document.createElement("table");
        const header = document.createElement("tr");
        colKeys.forEach((k) => {
          const th = document.createElement("th");
          th.textContent =
            typeof cols[k].title === "string" ? cols[k].title : "";
          header.appendChild(th);
        });
        table.appendChild(header);
        data.forEach((row) => {
          const tr = document.createElement("tr");
          colKeys.forEach((k) => {
            const td = document.createElement("td");
            if (cols[k].template) {
              // Render the template function result (Lit TemplateResult)
              const litResult = cols[k].template(row);
              // If it's a Node, append it; if not, set as innerHTML
              if (
                typeof litResult.values !== "undefined" &&
                Array.isArray(litResult.values)
              ) {
                // Try to render as HTML string
                const tmp = document.createElement("div");
                tmp.innerHTML = litResult.strings.join("");
                while (tmp.firstChild) td.appendChild(tmp.firstChild);
              } else if (litResult instanceof HTMLElement) {
                td.appendChild(litResult);
              } else {
                td.innerHTML = String(litResult);
              }
            } else {
              td.textContent = row[k] ?? "";
            }
            tr.appendChild(td);
          });
          table.appendChild(tr);
        });
        this.shadowRoot.appendChild(table);
      }
    }
    customElements.define("ha-data-table", DummyDataTable);
  }

  // Global helper to register any custom element by tag name
  globalThis.registerDummyElement = (tag) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  };
});

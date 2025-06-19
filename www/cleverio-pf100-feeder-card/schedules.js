// Schedules view logic and rendering
import DaysUtil from './utils/days-util.js';
import { renderEditView, attachEditListeners } from './edit.js';
import { mealsEqual } from './utils/mealplan-state.js';

// --- Schedules Dialog ---
export function showSchedulesView({ container, meals, onMealsChanged, onSave, onCancel }) {
  // Remove any existing dialog
  const oldDialog = container.querySelector('dialog.schedules-dialog');
  if (oldDialog) oldDialog.remove();

  let localMeals = meals.map(m => ({ ...m }));
  let currentView = 'table'; // 'table' or 'edit'
  let editIdx = null;

  // --- Render dialog ---
  const dialog = document.createElement('dialog');
  dialog.className = 'schedules-dialog';

  // Minimal custom CSS for layout tweaks only
  const style = document.createElement('style');
  style.textContent = `
    dialog.schedules-dialog {
      max-width: var(--ha-card-max-width, 420px);
      width: 100%;
      min-width: 280px;
      margin: 0;
      padding: var(--ha-card-padding, 0.5em 0.5em 0.2em 0.5em);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.16));
      background: var(--ha-card-background, var(--card-background-color, #222));
      color: var(--primary-text-color);
      font-family: var(--primary-font-family, inherit);
      display: flex;
      flex-direction: column;
      gap: var(--ha-card-section-margin, 1em);
      background-color: var(--ha-card-background, var(--card-background-color, #222));
      opacity: 1 !important;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      border: 1.5px solid var(--divider-color, #444);
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .popup-meal-table {
      font-size: 0.95em;
      margin-bottom: 0.5em;
      background: var(--ha-card-background, var(--card-background-color, #222));
      color: var(--primary-text-color);
      width: 100%;
      border-radius: var(--ha-card-border-radius, 12px);
      border-collapse: separate;
      border-spacing: 0;
      box-shadow: none;
      background-color: var(--ha-card-background, var(--card-background-color, #222));
      opacity: 1 !important;
      border: 1.5px solid var(--divider-color, #444);
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    }
    .popup-meal-table th, .popup-meal-table td {
      text-align: center;
      padding: 0.25em 0.4em;
      border-bottom: 1px solid var(--divider-color, #444);
      background: var(--ha-card-background, var(--card-background-color, #222));
      color: var(--primary-text-color);
      background-color: var(--ha-card-background, var(--card-background-color, #222));
      opacity: 1 !important;
      transition: background 0.2s, color 0.2s;
    }
    .popup-meal-table th {
      font-weight: 600;
      color: var(--primary-text-color);
      background: var(--ha-card-background, var(--card-background-color, #222));
      background-color: var(--ha-card-background, var(--card-background-color, #222));
      opacity: 1 !important;
      transition: background 0.2s, color 0.2s;
    }
    .popup-meal-table tr:hover {
      background: var(--table-row-background-hover, var(--primary-background-color, #333));
      background-color: var(--table-row-background-hover, var(--primary-background-color, #333));
      opacity: 1 !important;
      transition: background 0.2s, color 0.2s;
    }
    .schedules-title {
      font-size: 1.15em;
      margin: 0.5em 0 0.5em 0;
      text-align: center;
      color: var(--primary-text-color);
    }
    .add-schema-btn, .popup-actions-row button {
      border-radius: var(--ha-card-border-radius, 8px);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border: none;
      font-weight: 500;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      padding: var(--ha-card-button-padding, 0.3em 0.8em);
      font-size: 0.95em;
      margin-bottom: 0.2em;
    }
    .popup-actions-row {
      display: flex;
      gap: 0.7em;
      justify-content: flex-end;
      margin-top: 0.5em;
    }
  `;
  dialog.appendChild(style);

  // --- Render table view ---
  function renderTable() {
    dialog.innerHTML = '';
    dialog.appendChild(style);
    dialog.innerHTML += `
      <h3 class="schedules-title">Scheduled Meals</h3>
      <table class="popup-meal-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Portion</th>
            <th>Days</th>
            <th>Enabled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="popup-meal-table-body"></tbody>
      </table>
      <button class="add-schema-btn button" type="button">Add schedule</button>
      <div class="popup-actions-row">
        <button class="cancel-btn button" type="button">Cancel</button>
        <button class="save-btn button" type="button">Save</button>
      </div>
      <div class="save-helper" style="text-align:right;margin-top:0.2em;font-size:0.97em;"></div>
      <style>
        .action-btns {
          display: flex;
          gap: 0.3em;
          justify-content: center;
          align-items: center;
        }
        .icon-btn {
          background: none;
          border: none;
          padding: 0.2em;
          border-radius: 50%;
          cursor: pointer;
          color: var(--primary-text-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .icon-btn:active, .icon-btn:focus {
          background: var(--primary-color, #2196f3)11;
        }
        .icon-btn svg {
          width: 1.3em;
          height: 1.3em;
          display: block;
        }
      </style>
    `;
    const tbody = dialog.querySelector('.popup-meal-table-body');
    if (!localMeals || localMeals.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>';
    } else {
      tbody.innerHTML = localMeals.map((meal, idx) => {
        const days = DaysUtil.getDaysLabel(meal.daysMask || 0);
        return `
          <tr>
            <td>${meal.time}</td>
            <td>${meal.portion}</td>
            <td>${days}</td>
            <td><input type="checkbox" class="enabled-checkbox" data-idx="${idx}" ${meal.enabled ? 'checked' : ''}></td>
            <td><span class="action-btns">
              <button type="button" class="edit-row-btn icon-btn" data-idx="${idx}" aria-label="Edit schedule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
              </button>
              <button type="button" class="delete-row-btn icon-btn" data-idx="${idx}" aria-label="Delete schedule">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </span></td>
          </tr>
        `;
      }).join('');
    }
    // Add save helper logic
    const saveBtn = dialog.querySelector('.save-btn');
    const saveHelper = dialog.querySelector('.save-helper');
    const hasChanges = !mealsEqual(localMeals, meals);
    if (hasChanges) {
      saveBtn.style.background = 'var(--error-color, #e53935)';
      saveBtn.style.color = 'var(--text-primary-color, #fff)';
      saveBtn.style.boxShadow = '0 0 0 2px var(--error-color, #e53935)33';
      saveHelper.textContent = 'You have unsaved changes.';
      saveHelper.style.color = 'var(--error-color, #e53935)';
      saveBtn.disabled = false;
    } else {
      saveBtn.style.background = 'var(--primary-color)';
      saveBtn.style.color = 'var(--text-primary-color)';
      saveBtn.style.boxShadow = 'none';
      saveHelper.textContent = 'No changes to save.';
      saveHelper.style.color = 'var(--secondary-text-color, #888)';
      saveBtn.disabled = true;
    }
    // Attach events
    dialog.querySelector('.popup-meal-table-body').addEventListener('click', onTableClick);
    dialog.querySelector('.popup-meal-table-body').addEventListener('input', onTableInput);
    dialog.querySelector('.add-schema-btn').addEventListener('click', () => showEditViewInDialog());
    dialog.querySelector('.save-btn').addEventListener('click', () => {
      dialog.close();
      onSave(localMeals);
    });
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
      dialog.close();
      onCancel();
    });
  }

  function onTableClick(e) {
    const editBtn = e.target.closest('.edit-row-btn');
    const deleteBtn = e.target.closest('.delete-row-btn');
    if (editBtn) {
      showEditViewInDialog(Number(editBtn.dataset.idx));
    } else if (deleteBtn) {
      localMeals.splice(Number(deleteBtn.dataset.idx), 1);
      renderTable();
    }
  }
  function onTableInput(e) {
    if (e.target.classList.contains('enabled-checkbox')) {
      localMeals[Number(e.target.dataset.idx)].enabled = e.target.checked;
      renderTable();
    }
  }

  // --- Render edit view in dialog (submenu) ---
  function showEditViewInDialog(idx) {
    currentView = 'edit';
    editIdx = idx;
    dialog.innerHTML = '';
    dialog.appendChild(style);
    const meal = idx != null ? localMeals[idx] : null;
    const form = renderEditView({ meal });
    form.classList.add('edit-dialog');
    // Set selected days based on meal.daysMask
    if (meal && typeof meal.daysMask === 'number') {
      const dayBtns = Array.from(form.querySelectorAll('.day-btn'));
      dayBtns.forEach((btn, i) => {
        if (meal.daysMask & (1 << i)) btn.classList.add('selected');
        else btn.classList.remove('selected');
      });
    }
    dialog.appendChild(form);
    attachEditListeners({
      root: form,
      onBack: () => {
        renderTable();
      },
      onSave: e => {
        e.preventDefault();
        e.stopPropagation();
        const time = form.querySelector('.edit-time').value;
        const portion = Number(form.querySelector('.edit-portion').value);
        const dayBtns = Array.from(form.querySelectorAll('.day-btn'));
        const selectedDays = dayBtns
          .map((btn, i) => btn.classList.contains('selected') ? i : null)
          .filter(i => i !== null);
        const daysMask = selectedDays.reduce((mask, i) => mask | (1 << i), 0);
        const newMeal = { time, portion, daysMask, enabled: true };
        if (idx != null) localMeals[idx] = newMeal;
        else localMeals.push(newMeal);
        renderTable();
      },
      onDayToggle: e => {
        e.preventDefault();
        e.target.classList.toggle('selected');
      },
      onTimeSuggest: e => {
        e.preventDefault();
        const t = e.target.getAttribute('data-time');
        form.querySelector('.edit-time').value = t;
      }
    });
  }

  // Initial render
  renderTable();
  container.appendChild(dialog);
  dialog.showModal();
}

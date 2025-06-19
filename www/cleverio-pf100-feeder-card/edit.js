// CSS for edit view
const editStyle = `
  .edit-form {
    background: var(--ha-card-background, var(--card-background-color, #222));
    color: var(--primary-text-color);
    border-radius: var(--ha-card-border-radius, 12px);
    border: 1.5px solid var(--divider-color, #444);
    padding: var(--ha-card-padding, 1.2em 1.2em 1em 1.2em);
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px #0002);
    font-family: var(--primary-font-family, inherit);
    max-width: var(--ha-card-max-width, 420px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--ha-card-section-margin, 1em);
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .edit-days-row {
    display: flex;
    gap: 0.5em;
    justify-content: center;
    margin-bottom: 0.5em;
  }
  .day-btn {
    width: 2.4em;
    height: 2.4em;
    min-width: 2.4em;
    min-height: 2.4em;
    border-radius: 50%;
    border: 2px solid var(--divider-color, #888);
    background: var(--card-background-color, #eee);
    color: var(--primary-text-color);
    font-weight: bold;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
    margin-bottom: 0;
    position: relative;
    box-sizing: border-box;
  }
  .day-btn.selected {
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px #2196f344;
  }
  .day-btn.selected .day-check { display: inline; color: var(--text-primary-color); font-size: 1.1em; position: absolute; right: 0.3em; top: 0.2em; }
  .day-check { display: none; }
  .edit-fields-row {
    display: flex;
    gap: 1em;
    align-items: flex-end;
    margin-bottom: 0.2em;
  }
  .edit-fields-row label {
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    position: relative;
  }
  .edit-form input[type="time"],
  .edit-form input[type="number"] {
    height: 2.4em;
    border-radius: var(--ha-card-border-radius, 8px);
    border: 1.5px solid var(--divider-color, #ccc);
    background: var(--input-background-color, var(--card-background-color, #fff));
    color: var(--primary-text-color);
    font-size: 1em;
    padding: 0 0.7em;
    box-sizing: border-box;
    outline: none;
    transition: border 0.2s, background 0.2s;
    width: 100%;
  }
  .edit-form input[type="time"]:focus,
  .edit-form input[type="number"]:focus {
    border: 1.5px solid var(--primary-color);
    background: var(--input-background-color, var(--ha-card-background));
  }
  .edit-portion { width: 100%; min-width: 0; }
  .portion-helper {
    font-size: 0.95em;
    color: var(--secondary-text-color, #888);
    margin-top: 0.2em;
    display: block;
    line-height: 1.2;
    position: absolute;
    left: 0;
    bottom: -1.5em;
    white-space: nowrap;
    text-align: left;
    width: max-content;
    pointer-events: none;
  }
  .suggested-label {
    color: var(--secondary-text-color, #888);
    font-size: 0.97em;
    margin-left: 0.2em;
    margin-bottom: 0.2em;
    display: block;
  }
  .suggested-times-btn-row {
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1em;
    margin-left: 0.2em;
  }
  .suggested-time-btn {
    border-radius: var(--ha-card-border-radius, 8px);
    border: 2px solid var(--divider-color, #888);
    background: var(--card-background-color, #eee);
    color: var(--primary-text-color);
    font-weight: bold;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    padding: 0 1.1em;
    min-width: 3.2em;
    height: 2.2em;
  }
  .suggested-time-btn:active, .suggested-time-btn:focus {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: var(--text-primary-color);
  }
  menu { display: flex; gap: 1em; justify-content: flex-end; margin-top: 1em; }
  .edit-save-btn, .back-to-list-btn {
    border-radius: var(--ha-card-border-radius, 8px);
    background: var(--primary-color);
    color: var(--text-primary-color);
    border: none;
    font-weight: 500;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    padding: var(--ha-card-button-padding, 0.5em 1em);
  }
`;

// Render the edit view and return the root element
export function renderEditView({ meal }) {
  const form = document.createElement('form');
  form.className = 'edit-form';

  // Always attach CSS
  const style = document.createElement('style');
  style.textContent = editStyle;
  form.appendChild(style);

  form.innerHTML += `
    <h3 style="margin-top:0;">Edit Meal</h3>
    <div class="edit-days-row">
      ${['Mo','Tu','We','Th','Fr','Sa','Su'].map((abbr, i) => `<button type="button" class="day-btn button" data-day="${i}">${abbr}<span class="day-check" aria-hidden="true"></span></button>`).join('')}
    </div>
    <div class="edit-fields-row">
      <label>Time:
        <input class="edit-time" type="time" required value="${meal?.time || ''}">
      </label>
      <label style="position:relative;">
        Portion:
        <input class="edit-portion" type="number" min="1" required value="${meal?.portion || ''}">
        <span class="portion-helper">(1 portion = 6g)</span>
      </label>
    </div>
    <span class="suggested-label">Suggested:</span>
    <div class="suggested-times-btn-row">
      <button type="button" class="suggested-time-btn button" data-time="07:00">07:00</button>
      <button type="button" class="suggested-time-btn button" data-time="12:00">12:00</button>
      <button type="button" class="suggested-time-btn button" data-time="18:00">18:00</button>
    </div>
    <div class="edit-divider"></div>
    <menu>
      <button type="button" class="button back-to-list-btn">Back</button>
      <button type="submit" class="button edit-save-btn">Save</button>
    </menu>
  `;
  return form;
}

// Attach all listeners for the edit view
export function attachEditListeners({ root, onBack, onSave, onDayToggle, onTimeSuggest }) {
  root.querySelector('.back-to-list-btn')?.addEventListener('click', onBack);
  root.addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation(); // Prevent bubbling to parent dialogs
    if (onSave) onSave(e);
  });
  root.querySelectorAll('.day-btn').forEach(btn => btn.addEventListener('click', onDayToggle));
  root.querySelectorAll('.suggested-time-btn').forEach(btn => btn.addEventListener('click', onTimeSuggest));
}

// Main entry for orchestration
export function showEditView({ container, meal, onSave, onBack }) {
  container.innerHTML = '';
  const form = renderEditView({ meal });
  container.appendChild(form);
  attachEditListeners({
    root: form,
    onBack,
    onSave: e => {
      e.preventDefault();
      // You would extract meal data here and call onSave with the new meal
      // For now, just call onSave()
      onSave();
    },
    onDayToggle: () => {},
    onTimeSuggest: () => {}
  });
}

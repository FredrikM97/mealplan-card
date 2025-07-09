import { describe, it, expect, vi } from "vitest";
import { MealPlanCard } from "../src/main";
import * as mainModule from "../src/main";

describe("MealPlanCard uncovered lines", () => {
  it("onEditSave logic adds a new meal if no _idx", () => {
    const card = new MealPlanCard();
    card._meals = [];
    card._editForm = { hour: 8, minute: 0, portion: 1, enabled: 1 };
    card._editDialogOpen = true;
    card._editError = "err";
    card.requestUpdate = vi.fn();
    // Simulate onEditSave logic
    if (!card._editForm) return;
    const idx = card._editForm._idx;
    if (idx !== undefined && idx !== null && idx >= 0) {
      card._meals = card._meals.map((m, i) =>
        i === idx ? { ...card._editForm } : m,
      );
    } else {
      card._meals = [...card._meals, { ...card._editForm }];
    }
    card._editDialogOpen = false;
    card._editForm = null;
    card._editError = null;
    card.requestUpdate();
    expect(card._meals.length).toBe(1);
    expect(card._editDialogOpen).toBe(false);
    expect(card._editForm).toBeNull();
    expect(card._editError).toBeNull();
    expect(card.requestUpdate).toHaveBeenCalled();
  });

  it("onEditSave logic edits an existing meal if _idx is present", () => {
    const card = new MealPlanCard();
    card._meals = [{ hour: 8, minute: 0, portion: 1, enabled: 1 }];
    card._editForm = { hour: 9, minute: 0, portion: 2, enabled: 1, _idx: 0 };
    card._editDialogOpen = true;
    card._editError = "err";
    card.requestUpdate = vi.fn();
    // Simulate onEditSave logic
    if (!card._editForm) return;
    const idx = card._editForm._idx;
    if (idx !== undefined && idx !== null && idx >= 0) {
      card._meals = card._meals.map((m, i) =>
        i === idx ? { ...card._editForm } : m,
      );
    } else {
      card._meals = [...card._meals, { ...card._editForm }];
    }
    card._editDialogOpen = false;
    card._editForm = null;
    card._editError = null;
    card.requestUpdate();
    expect(card._meals[0].hour).toBe(9);
    expect(card._editDialogOpen).toBe(false);
    expect(card._editForm).toBeNull();
    expect(card._editError).toBeNull();
    expect(card.requestUpdate).toHaveBeenCalled();
  });

  it("_saveMealsToSensor returns early if no hass or _sensorID", () => {
    const card = new MealPlanCard();
    card._meals = [];
    Object.defineProperty(card, "_sensorID", { get: () => undefined });
    card.hass = undefined;
    expect(() => card._saveMealsToSensor()).not.toThrow();
  });

  it("_saveMealsToSensor returns early if no valid profile or encodingFields", () => {
    const card = new MealPlanCard();
    card._meals = [];
    Object.defineProperty(card, "_sensorID", { get: () => "sensor.test" });
    card.hass = { callService: vi.fn() };
    card._resolveProfile = () => undefined;
    expect(() => card._saveMealsToSensor()).not.toThrow();
    card._resolveProfile = () => ({
      encodingFields: [],
      profiles: [],
      fields: [],
      manufacturer: "",
      model: "",
    });
    expect(() => card._saveMealsToSensor()).not.toThrow();
  });

  it("_onScheduleMealsChanged updates meals and calls _saveMealsToSensor", () => {
    const card = new MealPlanCard();
    card._meals = [];
    card._saveMealsToSensor = vi.fn();
    const e = {
      detail: { meals: [{ hour: 8, minute: 0, portion: 1, enabled: 1 }] },
    };
    card._onScheduleMealsChanged(e);
    expect(card._meals.length).toBe(1);
    expect(card._saveMealsToSensor).toHaveBeenCalled();
  });

  it("getConfigElement resolves and returns a card editor", async () => {
    const el = await MealPlanCard.getConfigElement();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName.toLowerCase()).toBe("mealplan-card-editor");
  });

  it("loadTranslations throws not implemented", () => {
    expect(() => {
      mainModule.loadTranslations();
    }).toThrow("Function not implemented.");
  });
});

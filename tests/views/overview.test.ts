import { fixture, html, expect } from "@open-wc/testing";
import "../../src/main";
import { describe, it } from "vitest";

describe("MealPlanCard Overview UI", () => {
  it("decodes base64 meal plan and displays correct schedule and grams in UI", async () => {
    const base64 = btoa(String.fromCharCode(127, 2, 8, 0, 1));
    const config = {
      sensor: "sensor.test",
      title: "Test Card",
      device_manufacturer: "Cleverio",
      device_model: "",
    };
    const hass = {
      states: { "sensor.test": { state: base64, attributes: {} } },
    };
    const el = await fixture<any>(
      html`<mealplan-card .config=${config} .hass=${hass}></mealplan-card>`,
    );
    await el.updateComplete;
    const schedules = el.shadowRoot.querySelector(".overview-schedules");
    expect(schedules).to.exist;
    expect(Number(schedules.textContent.replace(/\D/g, ""))).to.be.greaterThan(
      0,
    );
    const active = el.shadowRoot.querySelector(".overview-active");
    expect(active).to.exist;
    expect(Number(active.textContent.replace(/\D/g, ""))).to.be.greaterThan(0);
    const grams = el.shadowRoot.querySelector(".overview-grams");
    expect(grams).to.exist;
    const gramsText = grams.textContent.toLowerCase().replace(/\s+/g, ' ').trim();
    expect(gramsText).to.match(/today: \d+g/);
  }, 20000);
});

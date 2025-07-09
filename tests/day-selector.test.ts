import { describe, it, expect, afterEach } from "vitest";
import { render } from "lit-html";
import { renderDaySelector } from "../src/day-selector";

afterEach(() => {
  document.querySelectorAll("div").forEach((div) => {
    if (div.parentNode === document.body) document.body.removeChild(div);
  });
});

it("defaults to all days unselected if mask is undefined", () => {
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: false }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell.selected");
  expect(cells.length).to.equal(0);
});

it("uses default labels if dayLabels is missing or wrong length", () => {
  const el1 = document.createElement("div");
  el1.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: false }), el1);
  document.body.appendChild(el1);
  const el2 = document.createElement("div");
  el2.innerHTML = "";
  render(
    renderDaySelector({ days: 0, editable: false, dayLabels: ["X", "Y"] }),
    el2,
  );
  document.body.appendChild(el2);
  const expected = ["M", "T", "W", "T", "F", "S", "S"];
  expect(
    Array.from(el1.querySelectorAll(".day-cell")).map((c) => c.textContent),
  ).to.deep.equal(expected);
  expect(
    Array.from(el2.querySelectorAll(".day-cell")).map((c) => c.textContent),
  ).to.deep.equal(expected);
});

it("does not throw or call onDaysChanged if onDaysChanged is missing", () => {
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: true }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  expect(() =>
    cells[1].dispatchEvent(new MouseEvent("click", { bubbles: true })),
  ).not.to.throw();
});

it("does not call onDaysChanged if editable is false, even if onDaysChanged is set", () => {
  let called = false;
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: false,
      onDaysChanged: () => {
        called = true;
      },
    }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  cells[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(called).to.be.false;
});

it("toggles the correct bit in the mask on click", () => {
  let changedMask = null;
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0b1010101,
      editable: true,
      onDaysChanged: (m) => {
        changedMask = m;
      },
    }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  // Click day 0 (bit 0 is set, should unset)
  cells[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(changedMask).to.equal(0b1010100);
  // Click day 1 (bit 1 is not set, should set)
  changedMask = null;
  cells[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(changedMask).to.equal(0b1010111);
});

it("renders 7 day cells with default labels", () => {
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: false }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  expect(cells.length).to.equal(7);
  expect(Array.from(cells).map((c) => c.textContent)).to.deep.equal([
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
  ]);
});

it("highlights selected days", () => {
  // Select Monday, Wednesday, Friday (bits 0,2,4)
  const mask = (1 << 0) | (1 << 2) | (1 << 4);
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: mask, editable: false }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell.selected");
  expect(cells.length).to.equal(3);
  expect(cells[0].textContent).to.equal("M");
  expect(cells[1].textContent).to.equal("W");
  expect(cells[2].textContent).to.equal("F");
});

it("uses custom day labels", () => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({ days: 0, editable: false, dayLabels: labels }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  expect(Array.from(cells).map((c) => c.textContent)).to.deep.equal(labels);
});

it("calls onDaysChanged with correct mask when editable", () => {
  let changedMask = null;
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: true,
      onDaysChanged: (m) => {
        changedMask = m;
      },
    }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  cells[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(changedMask).to.equal(1 << 2);
});

it("does not call onDaysChanged when not editable", () => {
  let called = false;
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: false,
      onDaysChanged: () => {
        called = true;
      },
    }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  cells[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  expect(called).to.be.false;
});

it("renders all days as selected if mask is 127", () => {
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 127, editable: false }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell.selected");
  expect(cells.length).to.equal(7);
});

it("renders no days as selected if mask is 0", () => {
  const el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: false }), el);
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell.selected");
  expect(cells.length).to.equal(0);
});

it("treats negative selectedDaysMask as all days selected, and >127 as 0", () => {
  const elNeg = document.createElement("div");
  elNeg.innerHTML = "";
  render(renderDaySelector({ days: -1, editable: false }), elNeg);
  document.body.appendChild(elNeg);
  const elBig = document.createElement("div");
  elBig.innerHTML = "";
  render(renderDaySelector({ days: 999, editable: false }), elBig);
  document.body.appendChild(elBig);
  expect(elNeg.querySelectorAll(".day-cell.selected").length).to.equal(7); // -1 is 0b1111111 (all days)
  expect(elBig.querySelectorAll(".day-cell.selected").length).to.equal(5); // 999 = 0b1111100111, so 5 days
});

it("handles dayLabels as non-array or wrong type gracefully", () => {
  const elStr = document.createElement("div");
  elStr.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: false,
      dayLabels: "not-an-array" as any,
    }),
    elStr,
  );
  document.body.appendChild(elStr);
  const elNum = document.createElement("div");
  elNum.innerHTML = "";
  render(
    renderDaySelector({ days: 0, editable: false, dayLabels: 123 as any }),
    elNum,
  );
  document.body.appendChild(elNum);
  const expected = ["M", "T", "W", "T", "F", "S", "S"];
  expect(
    Array.from(elStr.querySelectorAll(".day-cell")).map((c) => c.textContent),
  ).to.deep.equal(expected);
  expect(
    Array.from(elNum.querySelectorAll(".day-cell")).map((c) => c.textContent),
  ).to.deep.equal(expected);
});

it("toggles all days correctly in editable mode", () => {
  let mask = 0;
  const el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: true,
      onDaysChanged: (m) => {
        mask = m;
      },
    }),
    el,
  );
  document.body.appendChild(el);
  const cells = el.querySelectorAll(".day-cell");
  for (let i = 0; i < 7; i++) {
    cells[i].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mask & (1 << i)).to.equal(1 << i);
  }
});

it("renders correct DOM structure for all prop combinations", () => {
  // No props
  let el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: false }), el);
  document.body.appendChild(el);
  expect(el.querySelectorAll(".day-cell").length).to.equal(7);
  // Only editable
  el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 0, editable: true }), el);
  document.body.appendChild(el);
  expect(el.querySelectorAll(".day-cell").length).to.equal(7);
  // Only selectedDaysMask
  el = document.createElement("div");
  el.innerHTML = "";
  render(renderDaySelector({ days: 1, editable: false }), el);
  document.body.appendChild(el);
  expect(el.querySelectorAll(".day-cell.selected").length).to.equal(1);
  // Only dayLabels
  el = document.createElement("div");
  el.innerHTML = "";
  render(
    renderDaySelector({
      days: 0,
      editable: false,
      dayLabels: ["A", "B", "C", "D", "E", "F", "G"],
    }),
    el,
  );
  document.body.appendChild(el);
  expect(
    Array.from(el.querySelectorAll(".day-cell")).map((c) => c.textContent),
  ).to.deep.equal(["A", "B", "C", "D", "E", "F", "G"]);
});

import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'lit-html';
import { renderDaySelector } from '../src/components/day-selector';

const renderSelector = (options: any) => {
  const container = document.createElement('div');
  render(renderDaySelector(options), container);
  document.body.appendChild(container);
  return container;
};

const getCells = (container: HTMLElement) =>
  container.querySelectorAll('.day-cell');

const getLabels = (container: HTMLElement) =>
  Array.from(getCells(container)).map((c) => c.textContent);

const getSelectedCount = (container: HTMLElement) =>
  container.querySelectorAll('.day-cell.selected').length;

afterEach(() => {
  document.body
    .querySelectorAll('div')
    .forEach((div) => div.parentNode === document.body && div.remove());
});

describe('DaySelector', () => {
  describe('Rendering', () => {
    it('renders 7 cells with default labels', () => {
      const container = renderSelector({ days: 0, editable: false });
      expect(getCells(container).length).toBe(7);
      expect(getLabels(container)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    });

    it('uses custom labels when valid', () => {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const container = renderSelector({
        days: 0,
        editable: false,
        dayLabels: labels,
      });
      expect(getLabels(container)).toEqual(labels);
    });

    it('falls back to defaults for invalid labels', () => {
      const container = renderSelector({
        days: 0,
        editable: false,
        dayLabels: ['X', 'Y'],
      });
      expect(getLabels(container)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    });
  });

  describe('Selection Display', () => {
    it('shows correct selected days based on bitmask', () => {
      expect(
        getSelectedCount(renderSelector({ days: 0, editable: false })),
      ).toBe(0);
      expect(
        getSelectedCount(renderSelector({ days: 127, editable: false })),
      ).toBe(7);
      expect(
        getSelectedCount(renderSelector({ days: 0b0010101, editable: false })),
      ).toBe(3);
    });
  });

  describe('Interaction', () => {
    it('toggles days on/off when clicked in editable mode', () => {
      let mask = 0;
      let container = renderSelector({
        days: mask,
        editable: true,
        onDaysChanged: (m: number) => {
          mask = m;
        },
      });

      // Toggle on
      (getCells(container)[2] as HTMLElement).click();
      expect(mask).toBe(0b0000100);

      // Re-render with new mask to toggle off
      container.remove();
      container = renderSelector({
        days: mask,
        editable: true,
        onDaysChanged: (m: number) => {
          mask = m;
        },
      });

      (getCells(container)[2] as HTMLElement).click();
      expect(mask).toBe(0);
    });

    it('does not call onDaysChanged when not editable', () => {
      let called = false;
      const container = renderSelector({
        days: 0,
        editable: false,
        onDaysChanged: () => (called = true),
      });

      (getCells(container)[0] as HTMLElement).click();
      expect(called).toBe(false);
    });
  });
});

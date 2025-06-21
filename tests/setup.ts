import { beforeAll } from 'vitest';
import { EditView } from '../src/cleverio/edit';
import { ScheduleView } from '../src/cleverio/schedule';
import { OverviewsView } from '../src/cleverio/overview';
import { CardEditor } from '../src/cleverio/card-editor';

beforeAll(() => {
  // Optionally set up global variables or mocks here
  globalThis.__DEMO__ = false;

  // Mock Home Assistant elements globally for all tests
  const haElements = [
    'ha-card',
    'ha-dialog',
    'ha-button',
    'ha-textfield',
  ];
  haElements.forEach(tag => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  });

  // Register internal helper elements with their real classes for tests
  const internalElements: [string, CustomElementConstructor][] = [
    ['edit-view', EditView],
    ['schedule-view', ScheduleView],
    ['cleverio-overview-view', OverviewsView],
    ['card-editor', CardEditor],
  ];

  internalElements.forEach(([tag, ctor]) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, ctor);
    }
  });
});

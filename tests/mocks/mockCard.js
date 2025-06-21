// __mocks__/mockCard.js
export function createMockCard({ feedingTimes = [], modalState = { view: 'overview', index: null, editDays: null } } = {}) {
  let modalActive = false;
  let renderedHtml = '';
  const card = {
    feedingTimes,
    _modalState: { ...modalState },
    _stagedFeedingTimes: null,
    _unsaved: false,
    shadowRoot: {
      innerHTML: '',
      querySelector: (sel) => {
        if (sel === '#open-schedules') {
          // Use a function property on card, set after creation
          return { click: () => { if (typeof card.onOpenSchedules === 'function') card.onOpenSchedules(); } };
        }
        if (sel === '#schedules-modal') {
          return { classList: { add: () => { modalActive = true; }, remove: () => { modalActive = false; } }, innerHTML: renderedHtml };
        }
        return null;
      },
      querySelectorAll: () => []
    },
    getSchedulesModal: function() { return this.shadowRoot.querySelector('#schedules-modal'); },
    render: function() { renderedHtml = '<div id="schedules-modal" class="modal active">MOCK MODAL</div>'; },
    onOpenSchedules: null,
    setConfig: function() {},
    getModalActive: () => modalActive,
    getRenderedHtml: () => renderedHtml
  };
  return card;
}

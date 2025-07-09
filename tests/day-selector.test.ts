import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'lit-html';
import { renderDaySelector } from '../src/day-selector';

function mount(params: any) {
  const el = document.createElement('div');
  el.innerHTML = '';
  render(renderDaySelector(params), el);
  document.body.appendChild(el);
  return el;
}

  afterEach(() => {
    document.querySelectorAll('div').forEach(div => {
      if (div.parentNode === document.body) document.body.removeChild(div);
    });
  });

  it('defaults to all days unselected if mask is undefined', () => {
    const el = mount({ editable: false });
    const cells = el.querySelectorAll('.day-cell.selected');
    expect(cells.length).to.equal(0);
  });

  it('uses default labels if dayLabels is missing or wrong length', () => {
    const el1 = mount({ selectedDaysMask: 0, editable: false });
    const el2 = mount({ selectedDaysMask: 0, editable: false, dayLabels: ['X','Y'] });
    const expected = ['M','T','W','T','F','S','S'];
    expect(Array.from(el1.querySelectorAll('.day-cell')).map(c => c.textContent)).to.deep.equal(expected);
    expect(Array.from(el2.querySelectorAll('.day-cell')).map(c => c.textContent)).to.deep.equal(expected);
  });

  it('does not throw or call onDaysChanged if onDaysChanged is missing', () => {
    const el = mount({ selectedDaysMask: 0, editable: true });
    const cells = el.querySelectorAll('.day-cell');
    expect(() => cells[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))).not.to.throw();
  });

  it('does not call onDaysChanged if editable is false, even if onDaysChanged is set', () => {
    let called = false;
    const el = mount({ selectedDaysMask: 0, editable: false, onDaysChanged: () => { called = true; } });
    const cells = el.querySelectorAll('.day-cell');
    cells[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(called).to.be.false;
  });

  it('toggles the correct bit in the mask on click', () => {
    let changedMask = null;
    const el = mount({ selectedDaysMask: 0b1010101, editable: true, onDaysChanged: m => { changedMask = m; } });
    const cells = el.querySelectorAll('.day-cell');
    // Click day 0 (bit 0 is set, should unset)
    cells[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changedMask).to.equal(0b1010100);
    // Click day 1 (bit 1 is not set, should set)
    changedMask = null;
    cells[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changedMask).to.equal(0b1010111);
  });

  it('renders 7 day cells with default labels', () => {
    const el = mount({ selectedDaysMask: 0, editable: false });
    const cells = el.querySelectorAll('.day-cell');
    expect(cells.length).to.equal(7);
    expect(Array.from(cells).map(c => c.textContent)).to.deep.equal(['M','T','W','T','F','S','S']);
  });

  it('highlights selected days', () => {
    // Select Monday, Wednesday, Friday (bits 0,2,4)
    const mask = (1<<0) | (1<<2) | (1<<4);
    const el = mount({ selectedDaysMask: mask, editable: false });
    const cells = el.querySelectorAll('.day-cell.selected');
    expect(cells.length).to.equal(3);
    expect(cells[0].textContent).to.equal('M');
    expect(cells[1].textContent).to.equal('W');
    expect(cells[2].textContent).to.equal('F');
  });

  it('uses custom day labels', () => {
    const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const el = mount({ selectedDaysMask: 0, editable: false, dayLabels: labels });
    const cells = el.querySelectorAll('.day-cell');
    expect(Array.from(cells).map(c => c.textContent)).to.deep.equal(labels);
  });

  it('calls onDaysChanged with correct mask when editable', () => {
    let changedMask = null;
    const el = mount({ selectedDaysMask: 0, editable: true, onDaysChanged: m => { changedMask = m; } });
    const cells = el.querySelectorAll('.day-cell');
    cells[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changedMask).to.equal(1<<2);
  });

  it('does not call onDaysChanged when not editable', () => {
    let called = false;
    const el = mount({ selectedDaysMask: 0, editable: false, onDaysChanged: () => { called = true; } });
    const cells = el.querySelectorAll('.day-cell');
    cells[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(called).to.be.false;
  });

  it('renders all days as selected if mask is 127', () => {
    const el = mount({ selectedDaysMask: 127, editable: false });
    const cells = el.querySelectorAll('.day-cell.selected');
    expect(cells.length).to.equal(7);
  });

  it('renders no days as selected if mask is 0', () => {
    const el = mount({ selectedDaysMask: 0, editable: false });
    const cells = el.querySelectorAll('.day-cell.selected');
    expect(cells.length).to.equal(0);
  });

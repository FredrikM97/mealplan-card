// Quick script to fix schedule-view-component.test.ts
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  'tests/components/schedule-view-component.test.ts',
);
let content = fs.readFileSync(filePath, 'utf8');

// Replace all test fixtures to set meals first, then only pass mealState
content = content.replace(
  /it\('builds columns based on profile fields'[^}]*\}\);/s,
  `it('builds columns based on profile fields', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    const columns = (el as any).buildColumns();
    expect(columns).to.have.property('time');
    expect(columns).to.have.property('actions');
  });`,
);

content = content.replace(
  /it\('builds rows with index'[^}]*\}\);/s,
  `it('builds rows with index', async () => {
    const meals = [
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
      { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
    ];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    const rows = (el as any).buildRows();
    expect(rows.length).to.equal(2);
    expect(rows[0]._idx).to.equal(0);
    expect(rows[1]._idx).to.equal(1);
    expect(rows[0].hourMinute).to.equal(480); // 8 * 60 + 0
    expect(rows[1].hourMinute).to.equal(1110); // 18 * 60 + 30
  });`,
);

content = content.replace(
  /it\('handles open edit'[^}]*\}\);/s,
  `it('handles open edit', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).handleOpenEdit(0);
    expect((el as any).editState).to.exist;
    expect((el as any).editState.index).to.equal(0);
    expect((el as any).editState.meal.hour).to.equal(8);
  });`,
);

content = content.replace(
  /it\('handles open add'[^}]*\}\);/s,
  `it('handles open add', async () => {
    mealState.setMeals([]);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).handleOpenAdd();
    expect((el as any).editState).to.exist;
    expect((el as any).editState.index).to.be.undefined;
    expect((el as any).editState.meal.hour).to.equal(12);
    expect((el as any).editState.meal.portion).to.equal(1);
  });`,
);

content = content.replace(
  /it\('handles delete'[^}]*\}\);/s,
  `it('handles delete', async () => {
    const meals = [
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
      { hour: 18, minute: 0, portion: 10, days: 127, enabled: 1 },
    ];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).handleDelete(0);
    expect(mealState.meals.length).to.equal(1);
    expect(mealState.meals[0].hour).to.equal(18);
  });`,
);

content = content.replace(
  /it\('handles cancel'[^}]*\}\);/s,
  `it('handles cancel', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await (el as any).handleCancel();
    expect(eventFired).to.be.true;
  });`,
);

content = content.replace(
  /it\('handles save'[^}]*\}\);/s,
  `it('handles save', async () => {
    const hass = {
      states: {},
      callService: vi.fn(),
    };
    mealState.setHass(hass);
    mealState.setMeals([
      { hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 },
    ]);

    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    let eventFired = false;
    el.addEventListener('schedule-closed', () => {
      eventFired = true;
    });

    await (el as any).handleSave();
    expect(eventFired).to.be.true;
    expect(hass.callService.mock.calls.length).to.be.greaterThan(0);
  });`,
);

content = content.replace(
  /it\('handles toggle enabled'[^}]*\}\);/s,
  `it('handles toggle enabled', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    const event = {
      target: { checked: false },
    } as any;

    (el as any).handleToggleEnabled(0, event);
    expect(mealState.meals[0].enabled).to.equal(0);
  });`,
);

content = content.replace(
  /it\('handles edit save for new meal'[^}]*\}\);/s,
  `it('handles edit save for new meal', async () => {
    mealState.setMeals([]);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).editState = {
      index: undefined,
      meal: {},
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.meals.length).to.equal(1);
    expect(mealState.meals[0].hour).to.equal(12);
  });`,
);

content = content.replace(
  /it\('handles edit save for existing meal'[^}]*\}\);/s,
  `it('handles edit save for existing meal', async () => {
    const meals = [{ hour: 8, minute: 0, portion: 10, days: 127, enabled: 1 }];
    mealState.setMeals(meals);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).editState = {
      index: 0,
      meal: meals[0],
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 18, minute: 30, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.meals.length).to.equal(1);
    expect(mealState.meals[0].hour).to.equal(18);
    expect(mealState.meals[0].minute).to.equal(30);
  });`,
);

content = content.replace(
  /it\('handles edit save with validation error'[^}]*\}\);/s,
  `it('handles edit save with validation error', async () => {
    mealState.setMeals([]);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    (el as any).editState = {
      index: undefined,
      meal: {},
      error: null,
    };

    const customEvent = new CustomEvent('save', {
      detail: { hour: 25, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect((el as any).editState.error).to.not.be.null;
    expect(mealState.meals.length).to.equal(0);
  });`,
);

content = content.replace(
  /it\('returns empty object when profile is null'[^}]*\}\);/s,
  `it('returns empty object when profile is null', async () => {
    // Create a new mealState without profile by modifying it
    mealState.profile = null as any;
    mealState.setMeals([]);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    const columns = (el as any).buildColumns();
    expect(columns).to.deep.equal({});
  });`,
);

content = content.replace(
  /it\('does not handle edit save when editState is null'[^}]*\}\);/s,
  `it('does not handle edit save when editState is null', async () => {
    mealState.setMeals([]);
    const el = await fixture<ScheduleView>(
      html\`<schedule-view .mealState=\${mealState}></schedule-view>\`,
    );

    const customEvent = new CustomEvent('save', {
      detail: { hour: 12, minute: 0, portion: 5, days: 127, enabled: 1 },
    });

    (el as any).handleEditSave(customEvent);
    expect(mealState.meals.length).to.equal(0);
  });`,
);

fs.writeFileSync(filePath, content);
console.log('Fixed schedule-view-component.test.ts');

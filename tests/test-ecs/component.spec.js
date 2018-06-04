const tap = require('tap');
const { App, Component } = require('./dist/ecs');

tap.test('component', t => {
  class MockComponent extends Component {
    constructor() {
      super();
      this._onInitCalledCount = 0;
      this._onDestroyCalledCount = 0;
      this._onEnableCalledCount = 0;
      this._onDisableCalledCount = 0;
    }

    onInit() {
      this._onInitCalledCount++;
    }

    onDestroy() {
      this._onDestroyCalledCount++;
    }

    onEnable() {
      this._onEnableCalledCount++;
    }

    onDisable() {
      this._onDisableCalledCount++;
    }
  }
  tap.test('enabled', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    let ent2 = app.createEntity('ent2');
    ent2.active = false;
    let comp1 = ent.addComp('MockComponent');
    let comp2 = ent2.addComp('MockComponent');
    t.equal(comp1.enabled, true);
    t.equal(comp2.enabled, false);
    ent2.active = true;
    t.equal(comp2.enabled, true);
    comp1.enabled = false;
    t.equal(comp1.enabled, false);
    comp1.enabled = true;
    t.equal(comp1.enabled, true);
    comp1.enabled = true;
    ent.active = false;
    t.equal(comp1.enabled, false);
    t.end();
  });

  tap.test('destroyed', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    let comp = ent.addComp('MockComponent');
    t.equal(comp.destroyed, false);
    comp.destroy();
    t.equal(comp.destroyed, true);
    let ent2 = app.createEntity('ent2');
    let comp2 = ent2.addComp('MockComponent');
    ent2.destroy();
    t.equal(comp2.destroyed, true);
    t.end();
  });

  tap.test('onInit', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    let ent2 = app.createEntity('ent2');
    ent2.active = false;
    let comp1 = ent.addComp('MockComponent');
    let comp2 = ent2.addComp('MockComponent');
    t.equal(comp1._onInitCalledCount, 1);
    t.equal(comp2._onInitCalledCount, 0);
    ent2.active = true;
    t.equal(comp2._onInitCalledCount, 1);
    ent2.active = false;
    ent2.active = true;
    t.equal(comp1._onInitCalledCount, 1);
    t.equal(comp2._onInitCalledCount, 1);
    t.end();
  });

  tap.test('onDestroy', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    let comp = ent.addComp('MockComponent');
    t.equal(comp._onDestroyCalledCount, 0);
    ent.destroy();
    t.equal(comp._onDestroyCalledCount, 0);
    app.tick();
    t.equal(comp._onDestroyCalledCount, 1);

    ent = app.createEntity('ent');
    comp = ent.addComp('MockComponent');
    comp.destroy();
    t.equal(comp._onDestroyCalledCount, 0);
    app.tick();
    t.equal(comp._onDestroyCalledCount, 1);

    ent = app.createEntity('ent');
    ent.active = false;
    comp = ent.addComp('MockComponent');
    comp.destroy();
    t.equal(comp._onDestroyCalledCount, 0);
    app.tick();
    t.equal(comp._onDestroyCalledCount, 0);

    ent = app.createEntity('ent');
    ent.active = false;
    comp = ent.addComp('MockComponent');
    comp.enabled = false;
    ent.active = true;
    comp.destroy();
    t.equal(comp._onDestroyCalledCount, 0);
    app.tick();
    t.equal(comp._onDestroyCalledCount, 1);

    t.end();
  });

  tap.test('onEnable/onDisable', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    ent.active = false;
    let comp = ent.addComp('MockComponent');
    t.equal(comp._onEnableCalledCount, 0);
    t.equal(comp._onDisableCalledCount, 0);
    ent.active = true;
    t.equal(comp._onEnableCalledCount, 1);
    t.equal(comp._onDisableCalledCount, 0);
    ent = app.createEntity('ent');
    comp = ent.addComp('MockComponent');
    t.equal(comp._onEnableCalledCount, 1);
    t.equal(comp._onDisableCalledCount, 0);
    ent.active = false;
    ent.active = true;
    t.equal(comp._onEnableCalledCount, 2);
    t.equal(comp._onDisableCalledCount, 1);
    comp.enabled = false;
    comp.enabled = true;
    t.equal(comp._onEnableCalledCount, 3);
    t.equal(comp._onDisableCalledCount, 2);
    let parent = app.createEntity('parent');
    ent.setParent(parent);
    parent.active = false;
    t.equal(comp._onEnableCalledCount, 3);
    t.equal(comp._onDisableCalledCount, 3);
    parent.active = true;
    parent.active = false;
    t.equal(comp._onEnableCalledCount, 4);
    t.equal(comp._onDisableCalledCount, 4);
    let parent2 = app.createEntity('parent');
    ent.setParent(parent2);
    t.equal(comp._onEnableCalledCount, 5);
    t.equal(comp._onDisableCalledCount, 4);
    ent.destroy();
    t.equal(comp._onEnableCalledCount, 5);
    t.equal(comp._onDisableCalledCount, 5);
    t.end();
  });


  tap.test('destroy reentrance', t => {
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let ent = app.createEntity('ent');
    let comp = ent.addComp('MockComponent');
    ent.destroy();
    comp.destroy();
    comp.destroy();
    t.equal(app._deadComponents.length, 1);
    t.end();
  });

  t.end();
});
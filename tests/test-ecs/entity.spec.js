const tap = require('tap');
const { App, Entity } = require('./dist/ecs');
tap.test('entity', t => {
  // active
  tap.test('active', t => {
    let app = new App();

    tap.test('app.createEntity', t => {
      let ent = app.createEntity('entity1');
      t.assert(ent.active === true, 'Active is true for new entity.');
      t.end();
    });

    tap.test('ent.active=true/false', t => {
      let ent = app.createEntity('entity1');
      ent.active = false;
      t.assert(ent.active === false, 'Active is false if setted to false.');
      ent.active = true;
      t.assert(ent.active === true, 'Active is true if setted to true.');
      t.end();
    });

    tap.test('ent.deactivate/activate', t => {
      let ent = app.createEntity('entity1');
      ent.deactivate();
      t.assert(ent.active === false, 'Active is false if deactivate.');
      ent.activate();
      t.assert(ent.active === true, 'Active is true if activate.');
      t.end();
    });

    t.end();
  });

  tap.test('activeInHierarchy', t => {

    let app = new App();

    tap.test('app.createEntity with level', t => {
      // simulating unactivated level
      let mockLevel = new Entity('mockLevel');
      mockLevel.active = true;
      let ent = app.createEntity('entity1');
      t.assert(ent.activeInHierarchy === true, 'ActivateInHierarchy should be true when created to active Level.');

      let ent2 = app.createEntity('entity1', mockLevel);
      t.assert(ent2.activeInHierarchy === false, 'ActivateInHierarchy should be false when created to inacitve level.');
      t.end();
    });

    tap.test('app.createEntity and set parent', t => {
      let ent = app.createEntity('entity1');
      ent.setParent(null);
      // simulating activeInHierarchy entity;
      let mockEntity = app.createEntity('ent1');
      let mockEntity2 = app.createEntity('ent2');
      mockEntity2.active = false;
      t.assert(ent.activeInHierarchy === false, 'ActivateInHierarchy should be false when set to null parent.');
      ent.setParent(mockEntity);
      t.assert(ent.activeInHierarchy === true, 'ActivateInHierarchy should be true when set to activeInHierarchy parent.');
      ent.setParent(mockEntity2);
      t.assert(ent.activeInHierarchy === false, 'ActivateInHierarchy should be false when set to inactive parent.');
      t.end();
    });

    tap.test('active changed', t => {
      let mockEntity = app.createEntity('parent');
      let ent = app.createEntity('entity1');
      ent.setParent(mockEntity);
      mockEntity.active = false;
      ent.active = false;
      t.assert(ent.activeInHierarchy === false, 'ActivateInHierarchy should be false when parent is inactive.');
      ent.active = true;
      t.assert(ent.activeInHierarchy === false, 'ActivateInHierarchy should be false when parent is inactive.');
      mockEntity.active = true;
      ent.active = false;
      t.assert(ent.activeInHierarchy === false, 'ActivateInHierarchy should be false when self is inactive.');
      ent.active = true;
      t.assert(ent.activeInHierarchy === true, 'ActivateInHierarchy should be false when both self and hierarchy is active.');

      t.end();
    });
    t.end();
  });

  // active and inactive message
  tap.test('active and inactive message', t => {
    let app = new App();
    tap.test('set parent', t => {
      let ent = app.createEntity('entity1');
      // simulating activeInHierarchy entity;
      let mockEntity = app.createEntity('ent1');
      let mockEntity2 = app.createEntity('ent2');
      mockEntity2.active = false;
      let activeCount = 0;
      let deActiveCount = 0;
      ent.on('active', () => {
        activeCount += 1;
      });

      ent.on('inactive', () => {
        deActiveCount += 1;
      });

      ent.setParent(null);
      t.equal(deActiveCount, 1);
      ent.setParent(mockEntity);
      t.equal(activeCount, 1);
      ent.setParent(mockEntity2);
      t.equal(deActiveCount, 2);
      ent.setParent(mockEntity);
      t.equal(activeCount, 2);
      t.end();
    });

    tap.test('active changed', t => {
      let mockEntity = app.createEntity('parent');
      let ent = app.createEntity('entity1');
      ent.setParent(mockEntity);
      let activeCount = 0;
      let deActiveCount = 0;
      ent.on('active', () => {
        activeCount += 1;
      });

      ent.on('inactive', () => {
        deActiveCount += 1;
      });
      mockEntity.active = false;
      ent.active = false;
      t.equal(deActiveCount, 1);
      t.equal(activeCount, 0);
      mockEntity.active = true;
      ent.active = true;
      t.equal(deActiveCount, 1);
      t.equal(activeCount, 1);
      mockEntity.active = true;
      ent.active = false;
      t.equal(deActiveCount, 2);
      t.equal(activeCount, 1);
      ent.active = true;
      mockEntity.active = false;
      t.equal(deActiveCount, 3);
      t.equal(activeCount, 2);

      t.end();
    });

    t.end();
  });
  // activate and deactivate reentrance
  tap.test('activate and deactive reentrance', t => {
    let app = new App();
    let ent = app.createEntity('ent');
    let activeCount = 0;
    let inActiveCount = 0;
    ent.on('active', () => {
      activeCount++;
    });
    ent.on('inactive', () => {
      inActiveCount++;
    });
    ent.active = true;
    t.equal(activeCount, 0);
    t.equal(inActiveCount, 0);
    ent.active = false;
    t.equal(activeCount, 0);
    t.equal(inActiveCount, 1);
    ent.deactivate();
    t.equal(activeCount, 0);
    t.equal(inActiveCount, 1);
    ent.deactivate();
    t.equal(activeCount, 0);
    t.equal(inActiveCount, 1);
    ent.activate();
    t.equal(activeCount, 1);
    t.equal(inActiveCount, 1);
    ent.activate();
    t.equal(activeCount, 1);
    t.equal(inActiveCount, 1);
    t.end();
  });
  // destroy
  tap.test('destroy and destroy reentrance', t => {
    let app = new App();
    let ent = app.createEntity('entity1');
    ent.destroy();
    t.assert(ent._destroyed === true, 'should be labeled as destroyed when call destroy');
    let parent = app.createEntity('parent');
    let child = app.createEntity('child');
    child.setParent(parent);
    parent.destroy();
    t.assert(parent._destroyed === true, 'child and parent should be labeled as destroyed when call parent.destroy');
    t.assert(child._destroyed === true, 'child and parent should be labeled as destroyed when call parent.destroy');
    t.equal(app._deadEntities.length, 3);
    parent.destroy();
    t.equal(app._deadEntities.length, 3);
    t.end();
  });

  tap.test('dispatch', t => {
    let app = new App();

    let ent1 = app.createEntity('ent1');
    let ent1_1 = app.createEntity('ent1_1');
    let ent1_2 = app.createEntity('ent1_2');
    let ent1_1_1 = app.createEntity('ent1_1_1');
    let ent1_1_2 = app.createEntity('ent1_1_2');
    let ent1_2_1 = app.createEntity('ent1_2_1');
    let ent1_2_2 = app.createEntity('ent1_2_2');
    ent1_1.setParent(ent1);
    ent1_2.setParent(ent1);
    ent1_1_1.setParent(ent1_1);
    ent1_1_2.setParent(ent1_1);
    ent1_2_1.setParent(ent1_2);
    ent1_2_2.setParent(ent1_2);

    let eventCount = 0;
    ent1_1.on('foobar', (event) => {
      event.stop();
      ++eventCount;
    });

    ent1_2.on('foobar', (event) => {
      event.stop();
      ++eventCount;
    });

    ent1.on('foobar', () => {
      ++eventCount;
    });

    ent1_2_2.dispatch('foobar', {
      bubbles: true
    });
    t.equal(eventCount, 1);

    t.end();
  });

  // addComp
  tap.test('Components', t => {
    class MockComponent {
      constructor() {
        this._changeToFalseTime = 0;
        this._changeToTrueTime = 0;
      }

      destroy() {

      }
      _onEntityActiveChanged(val) {
        if (val) {
          this._changeToTrueTime++;
        } else {
          this._changeToFalseTime++;
        }
      }
    }

    class MockComponentMultiple {
      constructor() {

      }

      destroy() {

      }
      _onEntityActiveChanged() {

      }
    }

    MockComponentMultiple.multiple = true;

    tap.test('addComp, getComp and getComps', t => {
      let app = new App();

      app.registerClass('MockComponent', MockComponent);
      app.registerClass('MockComponentMultiple', MockComponentMultiple);
      let ent = app.createEntity('ent');
      let comp = ent.addComp('MockComponent');
      t.equal(ent._comps.length, 1);
      t.equal(ent._comps[0], comp);
      t.equal(ent.getComp('MockComponent'), comp);
      t.equal(ent.getComps('MockComponent').length, 1);
      t.equal(null, ent.addComp('MockComponent'));
      t.equal(ent.getComp('MockComponent'), comp);
      t.equal(ent.getComps('MockComponent').length, 1);
      t.equal(ent._comps.length, 1);

      let comp1 = ent.addComp('MockComponentMultiple');
      t.equal(ent._comps.length, 2);
      t.equal(ent._comps[1], comp1);
      t.equal(ent.getComp('MockComponentMultiple'), comp1);
      t.equal(ent.getComps('MockComponentMultiple').length, 1);

      let comp2 = ent.addComp('MockComponentMultiple');
      t.equal(ent._comps.length, 3);
      t.equal(ent._comps[2], comp2);
      // should return the first one
      t.equal(ent.getComp('MockComponentMultiple'), comp1);
      let comps = ent.getComps('MockComponentMultiple');
      t.equal(comps.length, 2);
      t.equal(comps[0], comp1);
      t.equal(comps[1], comp2);

      t.end();
    });

    tap.test('comp._onEntityActiveChanged', t => {
      let app = new App();

      app.registerClass('MockComponent', MockComponent);
      tap.test('set parent', t => {
        let ent = app.createEntity('entity1');
        // simulating activeInHierarchy entity;
        let mockEntity = app.createEntity('ent1');
        let mockEntity2 = app.createEntity('ent2');
        mockEntity2.active = false;

        let comp = ent.addComp('MockComponent');
        t.equal(comp._changeToFalseTime, 0);
        t.equal(comp._changeToTrueTime, 1);

        ent.setParent(null);
        t.equal(comp._changeToFalseTime, 1);
        t.equal(comp._changeToTrueTime, 1);
        ent.setParent(mockEntity);
        t.equal(comp._changeToFalseTime, 1);
        t.equal(comp._changeToTrueTime, 2);
        ent.setParent(mockEntity2);
        t.equal(comp._changeToFalseTime, 2);
        t.equal(comp._changeToTrueTime, 2);
        ent.setParent(mockEntity);
        t.equal(comp._changeToFalseTime, 2);
        t.equal(comp._changeToTrueTime, 3);
        t.end();
      });

      tap.test('active changed', t => {
        let mockEntity = app.createEntity('parent');
        let ent = app.createEntity('entity1');
        let comp = ent.addComp('MockComponent');
        t.equal(comp._changeToFalseTime, 0);
        t.equal(comp._changeToTrueTime, 1);
        ent.setParent(mockEntity);
        t.equal(comp._changeToFalseTime, 0);
        t.equal(comp._changeToTrueTime, 1);
        mockEntity.active = false;
        ent.active = false;
        t.equal(comp._changeToFalseTime, 1);
        t.equal(comp._changeToTrueTime, 1);
        mockEntity.active = true;
        ent.active = true;
        t.equal(comp._changeToFalseTime, 1);
        t.equal(comp._changeToTrueTime, 2);
        mockEntity.active = true;
        ent.active = false;
        t.equal(comp._changeToFalseTime, 2);
        t.equal(comp._changeToTrueTime, 2);
        ent.active = true;
        mockEntity.active = false;
        t.equal(comp._changeToFalseTime, 3);
        t.equal(comp._changeToTrueTime, 3);

        t.end();
      });

      t.end();
    });

    // getCompsInChildren
    tap.test('getCompsInChildren', t => {
      let app = new App();
      let parent = app.createEntity('parent');
      let child0 = app.createEntity('child');
      let child1 = app.createEntity('child');
      child0.setParent(parent);
      child1.setParent(parent);
      app.registerClass('MockComponent', MockComponent);
      app.registerClass('MockComponentMultiple', MockComponentMultiple);

      parent.addComp('MockComponent');

      let comps = parent.getCompsInChildren('MockComponent');
      t.equal(comps.length, 0);

      let comp0 = child0.addComp('MockComponent');
      comps = parent.getCompsInChildren('MockComponent');
      t.equal(comps.length, 1);
      t.equal(comp0, comps[0]);

      let comp1 = child1.addComp('MockComponent');
      comps = parent.getCompsInChildren('MockComponent');
      t.equal(comps.length, 2);
      t.equal(comp0, comps[0]);
      t.equal(comp1, comps[1]);

      comp0 = child0.addComp('MockComponentMultiple');
      comps = parent.getCompsInChildren('MockComponentMultiple');
      t.equal(comps.length, 1);
      t.equal(comp0, comps[0]);

      comp1 = child1.addComp('MockComponentMultiple');
      comps = parent.getCompsInChildren('MockComponentMultiple');
      t.equal(comps.length, 2);
      t.equal(comp0, comps[0]);
      t.equal(comp1, comps[1]);

      let comp2 = child0.addComp('MockComponentMultiple');
      comps = parent.getCompsInChildren('MockComponentMultiple');
      t.equal(comps.length, 3);
      t.equal(comp0, comps[0]);
      t.equal(comp2, comps[1]);
      t.equal(comp1, comps[2]);

      t.end();
    });
    t.end();
  });

  // clone

  tap.test('entity.clone', t => {
    class MockComponent {
      constructor() {
      }

      destroy() {

      }
      _onEntityActiveChanged(val) {
      }
    }
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let parent = app.createEntity('parent');
    let child = app.createEntity('child');
    child.setParent(parent);
    parent.addComp('MockComponent');
    let cloned = parent.clone();
    t.equal(cloned.active, parent.active);
    t.equal(cloned.children.length, 0);
    t.equal(cloned._comps.length, parent._comps.length);
    t.assert(cloned._comps[0] instanceof MockComponent, 'component should be cloned!');
    t.end();
  });

  // entity.deepClone

  tap.test('entity.deepClone', t => {
    class MockComponent {
      constructor() {
      }

      destroy() {

      }
      _onEntityActiveChanged(val) {
      }
    }
    let app = new App();
    app.registerClass('MockComponent', MockComponent);
    let parent = app.createEntity('parent');
    let child = app.createEntity('child');
    let child2 = app.createEntity('child2');
    child2.active = false;
    child.setParent(parent);
    child2.setParent(parent);
    parent.addComp('MockComponent');
    child.addComp('MockComponent');
    let cloned = parent.deepClone();
    t.equal(cloned.active, parent.active);
    t.equal(cloned.children.length, 2);
    t.equal(cloned._comps.length, parent._comps.length);
    t.assert(cloned._comps[0] instanceof MockComponent, 'component should be cloned!');
    let clonedChild = cloned.children[0];
    t.equal(clonedChild.active, child.active);
    t.assert(clonedChild._comps[0] instanceof MockComponent, 'component should be cloned!');
    t.equal(cloned.children[1].active, child2.active);
    t.end();
  });

  t.end();
});
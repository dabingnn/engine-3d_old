const tap = require('./tap');
const { VTween } = require('./dist/vtween');
const vmath = require('vmath');
const { vec2, vec3, quat } = vmath;

class entity {
  constructor(params = {}) {
    this.lfloat = params.lfloat;
    this.lvec2 = params.lvec2;
    this.lvec3 = params.lvec3;
    this.lquat = params.lquat;
  }
}

var vEngine = new VTween();

tap.test('vtween', t => {

  t.test('vtween Play', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 0,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }

    let ent = new entity(entProp);

    let vtween1 = vEngine.newTask(ent, {
      lfloat: { keys: { value: 1, duration: 1000 }, type: 'number' }
    }, {
        autoplay: false,
      });


    vtween1.play();
    vEngine.tick(500);
    vEngine.tick(800);

    t.approx(ent.lfloat, 0.3);

    t.end();
  });

  t.test('Multiple Entities', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }
    let ent1 = new entity(entProp);
    let ent2 = new entity(entProp);

    let vtween1 = vEngine.newTask([ent1, ent2], {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
      });

    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent1.lvec3, [0.3, 0.3, 0.3]);
    t.equal_v3(ent2.lvec3, [0.3, 0.3, 0.3]);

    t.end();
  });

  t.test('vtween Pause', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }

    let ent = new entity(entProp);
    let vtween1 = vEngine.newTask(ent, {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
        duration: 1000
      });

    vtween1.pause();

    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0, 0, 0]);
    vEngine.tick(1000);
    t.equal_v3(ent.lvec3, [0, 0, 0]);

    t.end();
  });

  t.test('vtween Pause and Play', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }

    let ent = new entity(entProp);

    let vtween1 = vEngine.newTask(ent, {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
        duration: 1000
      });

    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);
    vtween1.pause();
    vEngine.tick(1000);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);
    vtween1.play();
    vtween1.pause();
    vtween1.play();
    vEngine.tick(1000);
    vEngine.tick(1200);
    t.equal_v3(ent.lvec3, [0.5, 0.5, 0.5]);

    t.end();
  });

  t.test('vtween Restart', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }
    let ent = new entity(entProp);

    let vtween1 = vEngine.newTask(ent, {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
        duration: 1000
      });

    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);
    vtween1.restart();
    vEngine.tick(800);
    vEngine.tick(1000);
    t.equal_v3(ent.lvec3, [0.2, 0.2, 0.2]);

    t.end();
  });

  t.test('vtween Reverse', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }

    let ent = new entity(entProp);
    let vtween1 = vEngine.newTask(ent, {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
        duration: 1000
      });
    vtween1.play();
    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);
    vEngine.tick(1000);
    t.equal_v3(ent.lvec3, [0.5, 0.5, 0.5]);
    vtween1.reverse();
    vEngine.tick(1000);
    vEngine.tick(1200);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);

    t.end();
  });

  t.test('vtween CallBack', t => {
    let vec2A, vec3A, quatA;
    vec2A = vec2.create();
    vec2.set(vec2A, 0, 0);
    vec3A = vec3.create();
    vec3.set(vec3A, 0, 0, 0);
    quatA = quat.create();
    quat.set(quatA, 0, 0, 0, 0);

    let funA = function () {
      console.log('begin');
    }
    let funB = function () {
      console.log('complete');
    }
    let funC = function () {
      console.log('run');
    }
    let funD = function () {
      console.log('update');
    }

    const entProp = {
      lfloat: 1,
      lvec2: vec2A,
      lvec3: vec3A,
      lquat: quatA
    }

    let ent = new entity(entProp);

    let vtween1 = vEngine.newTask(ent, {
      lvec3: { keys: { value: [1, 1, 1] }, type: 'vec3' }
    }, {
        duration: 1000
      });

    vtween1.start = funA;
    vtween1.end = funB;
    vtween1.run = funC;
    vtween1.update = funD;

    vEngine.tick(500);
    vEngine.tick(1500);

    t.end();
  });

  t.end();
})


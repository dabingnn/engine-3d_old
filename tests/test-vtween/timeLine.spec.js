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

  t.test('one track,mult key', t => {
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
      lvec3: {
        keys: [
          { value: [[0, 0, 0], [1, 1, 1]], duration: 1000 },
          { value: [2, 2, 2], type: 'vec3' }]
        ,
        type: 'vec3'
      }
    },
      {
        autoplay: false,
      });

    vtween1.play();
    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);
    vEngine.tick(2000);
    t.equal_v3(ent.lvec3, [1.5, 1.5, 1.5]);

    t.end();
  });

  t.test('time line', t => {
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
      lvec3: {
        keys: [
          { value: [[0, 0, 0], [1, 1, 1]], duration: 1000 }],
        type: 'vec3'
      }
    },
      {
        autoplay: false,
      });
    let timeLine = vEngine.newTimeLine({});
    timeLine.add(vtween1);
    timeLine.play();
    vEngine.tick(500);
    vEngine.tick(800);
    t.equal_v3(ent.lvec3, [0.3, 0.3, 0.3]);

    t.end();
  });

  t.end();
});
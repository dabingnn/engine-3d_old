const tap = require('tap');
const { math } = require('../../dist/engine');
const vec3 = math.vec3;
const quat = math.quat;
const { Node, utils } = require('./dist/scene-graph');

tap.test('utils', t => {

  t.test('clone', t => {
    let root = new Node('root');
    let n0 = new Node('n0');
    let n1 = new Node('n1');
    let n2 = new Node('n2');

    n0.setParent(root);
    n1.setParent(n0);
    n2.setParent(n1);

    vec3.set(n0.lpos, 1,2,3);
    vec3.set(n0.lscale, 2,2,2);

    let n0_2 = utils.clone(n0);
    t.equal(n0_2.name, 'n0');
    t.assert(vec3.equals(n0_2.lpos, vec3.new(1,2,3)));
    t.assert(vec3.equals(n0_2.lrot, quat.new(0,0,0,1)));
    t.assert(vec3.equals(n0_2.lscale, vec3.new(2,2,2)));
    t.deepEqual(n0_2._children, []);
    t.equal(n0_2._parent, null);

    t.end();
  });

  t.test('deepClone', t => {
    let root = new Node('root');
    let n0 = new Node('n0');
    let n1 = new Node('n1');
    let n2 = new Node('n2');

    n0.setParent(root);
    n1.setParent(n0);
    n2.setParent(n1);

    vec3.set(n0.lpos, 1,2,3);
    vec3.set(n0.lscale, 2,2,2);

    let root2 = utils.deepClone(root);
    t.equal(root2.name, 'root');
    t.equal(root2.children[0].name, 'n0');
    t.notEqual(root2.children[0], n0);
    t.equal(root2.children[0]._parent, root2);

    t.end();
  });

  t.test('find', t => {
    let root = new Node('root');
    let n0 = new Node('n0');
    let n0_0 = new Node('n0_0');
    let n0_1 = new Node('n0_1');
    let n0_2 = new Node('n0_2');
    let n0_0_0 = new Node('n0_0_0');
    let n1 = new Node('n1');
    let n2 = new Node('n2');
    let n3 = new Node('n3');
    let n3_0 = new Node('n3_0');
    let n3_1 = new Node('n3_1');
    let n3_2 = new Node('n3_2');
    let n3_3 = new Node('n3_3');
    let n3_3_0 = new Node('n3_3_0');
    let n3_3_1 = new Node('n3_3_1');
    let n3_3_2 = new Node('n3_3_2');

    n0.setParent(root);
    n0_0.setParent(n0);
    n0_1.setParent(n0);
    n0_2.setParent(n0);
    n0_0_0.setParent(n0_0);
    n1.setParent(root);
    n2.setParent(root);
    n3.setParent(root);
    n3_0.setParent(n3);
    n3_1.setParent(n3);
    n3_2.setParent(n3);
    n3_3.setParent(n3);
    n3_3_0.setParent(n3_3);
    n3_3_1.setParent(n3_3);
    n3_3_2.setParent(n3_3);

    t.equal(utils.find(root, 'n0/n0_0'), n0_0);
    t.equal(utils.find(root, 'n1'), n1);
    t.equal(utils.find(root, 'n3/n3_3/n3_3_2'), n3_3_2);
    t.equal(utils.find(root, 'n3/n3_2/n3_3_2'), null);
    t.equal(utils.find(root, 'foobar'), null);
    t.equal(utils.find(root, 'foo/bar'), null);

    t.end();
   });

  t.end();
});
import { vec3, quat } from '../vmath';
import Node from './node';

/**
 * @method walk
 * @param {Node} node
 * @param {function(node: Node, parent: Node, level: number): boolean} fn
 * @param {number} level
 */
function walk(node, fn, level = 0) {
  level += 1;
  let len = node.children.length;

  for (let i = 0; i < len; ++i) {
    let child = node.children[i];
    let continueWalk = fn(child, node, level);

    if (continueWalk === false) {
      break;
    }

    walk(child, fn, level);
  }
}

/**
 * fn1 is used when entering the node, fn2 is used when leaving the node
 * @param {Node} node
 * @param {function(node: Node, parent: Node, level: number): boolean} fn1
 * @param {function(node: Node, parent: Node, level: number)} fn2
 * @param {number} level
 */
function walk2(node, fn1, fn2, level = 0) {
  level += 1;
  let len = node.children.length;

  for (let i = 0; i < len; ++i) {
    let child = node.children[i];
    let continueWalk = fn1(child, node, level);

    if (continueWalk === false) {
      fn2(child, node, level);
      break;
    }

    walk2(child, fn1, fn2, level);
    fn2(child, node, level);
  }
}

/**
 * walkSibling is almost same as walk except when the fn return false,
 * it just break walk in children but not break walk in sibiling
 *
 * @method walkSibling
 * @param {Node} node
 * @param {function(node: Node, parent: Node, level: number): boolean} fn
 * @param {number} level
 */
function walkSibling(node, fn, level = 0) {
  level += 1;
  let len = node.children.length;

  for (let i = 0; i < len; ++i) {
    let child = node.children[i];
    let continueWalk = fn(child, node, level);

    if (continueWalk !== false) {
      walkSibling(child, fn, level);
    }
  }
}

/**
 * @method flat
 * @param {Node} node
 */
function flat(node) {
  let out = [];

  out.push(node);
  walk(node, function (iter) {
    out.push(iter);
  });

  return out;
}

/**
 * @method replace
 * @param {Node} oldNode
 * @param {Node} newNode
 */
function replace(oldNode, newNode) {
  newNode.remove();

  let parent = oldNode._parent;
  if (!parent) {
    return;
  }

  oldNode._parent = null;
  newNode._parent = parent;

  let len = parent._children.length;
  for (let i = 0; i < len; ++i) {
    if (parent._children[i] === oldNode) {
      parent._children[i] = newNode;
      return;
    }
  }
}

/**
 * @method clone
 * @param {Node} node
 * @param {function} ctor
 * @param {function} fn
 * @return {Node}
 */
function clone(node, ctor = Node, fn = null) {
  let newNode = new ctor();
  newNode.name = node.name;
  vec3.copy(newNode.lpos, node.lpos);
  vec3.copy(newNode.lscale, node.lscale);
  quat.copy(newNode.lrot, node.lrot);

  // do user custom clone function
  if (fn) {
    fn(newNode, node);
  }

  return newNode;
}

/**
 * @method deepClone
 * @param {Node} node
 * @param {function} ctor
 * @param {function} fn
 * @return {Node}
 */
function deepClone(node, ctor = Node, fn = null) {
  let newNode = clone(node, ctor, fn);

  newNode._children = new Array(node._children.length);
  for (let i = 0; i < node._children.length; ++i) {
    let child = node._children[i];
    let newChild = deepClone(child, ctor, fn);
    newNode._children[i] = newChild;
    newChild._parent = newNode;
  }

  return newNode;
}

/**
 * @method find
 * @param {Node} root
 * @param {string} path
 */
function find(root, path) {
  let names = path.split('/');

  function _recurse(node, level) {
    let len = node.children.length;
    let name = names[level];

    for (let i = 0; i < len; ++i) {
      let child = node.children[i];

      if (child.name !== name) {
        continue;
      }

      if (level === names.length - 1) {
        return child;
      } else {
        return _recurse(child, level + 1);
      }
    }

    return null;
  }

  return _recurse(root, 0);
}

let utils = {
  walk,
  walk2,
  walkSibling,
  flat,
  replace,
  clone,
  deepClone,
  find,
};
export default utils;
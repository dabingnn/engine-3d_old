import { vec3, mat3, mat4 } from '../vmath';

class _box {
  constructor(px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
    this.center = vec3.new(px, py, pz);
    this.size =  vec3.new(w, h, l);
    this.orientation = mat3.new(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  }
}

/**
 * @class box
 * @name box
 */
let box = {};

/**
 * create a new box
 *
 * @return {plane}
 */
box.create = function () {
  return new _box(0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);
};

/**
 * create a new box
 *
 * @param {Number} px X coordinates for box's original point
 * @param {Number} py Y coordinates for box's original point
 * @param {Number} pz Z coordinates for box's original point
 * @param {Number} w the half of box width
 * @param {Number} h the half of box height
 * @param {Number} l the half of box length
 * @param {Number} ox_1 the orientation vector coordinates
 * @param {Number} ox_2 the orientation vector coordinates
 * @param {Number} ox_3 the orientation vector coordinates
 * @param {Number} oy_1 the orientation vector coordinates
 * @param {Number} oy_2 the orientation vector coordinates
 * @param {Number} oy_3 the orientation vector coordinates
 * @param {Number} oz_1 the orientation vector coordinates
 * @param {Number} oz_2 the orientation vector coordinates
 * @param {Number} oz_3 the orientation vector coordinates
 * @return {box}
 */
box.new = function (px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
  return new _box(px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
};

/**
 * create a new axis-aligned box from two corner points
 *
 * @param {vec3} minPos lower corner position of the box
 * @param {vec3} maxPos upper corner position of the box
 * @return {box}
 */
box.fromPoints = (function () {
  let center = vec3.zero();
  let halfSize = vec3.zero();
  return function (minPos, maxPos) {
    vec3.scale(center, vec3.add(center, minPos, maxPos), 0.5);
    vec3.scale(halfSize, vec3.sub(halfSize, maxPos, minPos), 0.5);
    return new _box(center.x, center.y, center.z, 
      halfSize.x, halfSize.y, halfSize.z, 
      1, 0, 0, 0, 1, 0, 0, 0, 1);
  };
})();

/**
 * Set the transform information of the box
 *
 * @param {box} out the receiving box
 * @param {mat4} mat transform matrix
 * @param {box} parent parent box transform to apply
 * @return {box}
 */
box.setTransform = function (out, mat, parent = null) {
  mat3.fromMat4(out.orientation, mat);
  mat4.getTranslation(out.center, mat);
  if (parent) {
    mat3.mul(out.orientation, out.orientation, parent.orientation);
    vec3.add(out.center, out.center, parent.center);
  }
  return out;
};

/**
 * clone a new box
 *
 * @param {box} a the source box
 * @return {box}
 */
box.clone = function (a) {
  return new _box(a.center.x, a.center.y, a.center.z, 
    a.size.x, a.size.y, a.size.z, 
    a.orientation.m00, a.orientation.m01, a.orientation.m02,
    a.orientation.m03, a.orientation.m04, a.orientation.m05,
    a.orientation.m06, a.orientation.m07, a.orientation.m08);
};

/**
 * copy the values from one box to another
 *
 * @param {box} out the receiving box
 * @param {box} a the source box
 * @return {box}
 */
box.copy = function (out, a) {
  out.center = a.center;
  out.size = a.size;
  out.orientation = a.orientation;

  return out;
};

/**
 * Set the components of a box to the given values
 *
 * @param {box} out the receiving box
 * @param {Number} px X coordinates for box's original point
 * @param {Number} py Y coordinates for box's original point
 * @param {Number} pz Z coordinates for box's original point
 * @param {Number} w the half of box width
 * @param {Number} h the half of box height
 * @param {Number} l the half of box length
 * @param {Number} ox_1 the orientation vector coordinates
 * @param {Number} ox_2 the orientation vector coordinates
 * @param {Number} ox_3 the orientation vector coordinates
 * @param {Number} oy_1 the orientation vector coordinates
 * @param {Number} oy_2 the orientation vector coordinates
 * @param {Number} oy_3 the orientation vector coordinates
 * @param {Number} oz_1 the orientation vector coordinates
 * @param {Number} oz_2 the orientation vector coordinates
 * @param {Number} oz_3 the orientation vector coordinates
 * @returns {box} out
 * @function
 */
box.set = function (out, px, py, pz, w, h, l, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
  vec3.set(out.center, px, py, pz);
  vec3.set(out.size, w, h, l);
  mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
  return out;
};

export default box;

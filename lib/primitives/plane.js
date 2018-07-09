'use strict';

import { vec3 } from '../vmath';

let temp1 = vec3.zero();
let temp2 = vec3.zero();
let temp3 = vec3.zero();
let r = vec3.zero();
let c00 = vec3.zero();
let c10 = vec3.zero();
let c01 = vec3.zero();

/**
 * @param {Number} width
 * @param {Number} length
 * @param {Object} opts
 * @param {Number} opts.widthSegments
 * @param {Number} opts.lengthSegments
 */
export default function (width, length, opts = {}) {
  let uSegments = opts.widthSegments !== undefined ? opts.widthSegments : 5;
  let vSegments = opts.lengthSegments !== undefined ? opts.lengthSegments : 5;

  let hw = width * 0.5;
  let hl = length * 0.5;

  let positions = [];
  let normals = [];
  let uvs = [];
  let indices = [];
  let minPos = vec3.new(-hw, 0, -hl);
  let maxPos = vec3.new(hw, 0, hl);

  vec3.set(c00, -hw, 0,  hl);
  vec3.set(c10,  hw, 0,  hl);
  vec3.set(c01, -hw, 0, -hl);

  for (let y = 0; y <= vSegments; y++) {
    for (let x = 0; x <= uSegments; x++) {
      let u = x / uSegments;
      let v = y / vSegments;

      vec3.lerp(temp1, c00, c10, u);
      vec3.lerp(temp2, c00, c01, v);
      vec3.sub(temp3, temp2, c00);
      vec3.add(r, temp1, temp3);

      positions.push(r.x, r.y, r.z);
      normals.push(0, 1, 0);
      uvs.push(u, v);

      if ((x < uSegments) && (y < vSegments)) {
        let useg1 = uSegments + 1;
        let a = x + y * useg1;
        let b = x + (y + 1) * useg1;
        let c = (x + 1) + (y + 1) * useg1;
        let d = (x + 1) + y * useg1;

        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
  }

  return {
    positions,
    normals,
    uvs,
    indices,
    minPos,
    maxPos
  };
}

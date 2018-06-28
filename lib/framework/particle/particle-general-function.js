import { mat4, quat, randomRange, vec3, random, vec2, randomRangeInt } from '../../vmath';
import { sign } from '../../vmath/bits';

export const particleEmitZAxis = vec3.new(0, 0, -1);

export function calculateTransform(systemSpace, moduleSpace, worldTransform, outQuat) {
  if (moduleSpace !== systemSpace) {
    if (systemSpace === 'world') {
      mat4.getRotation(outQuat, worldTransform);
    }
    else {
      mat4.invert(worldTransform, worldTransform);
      mat4.getRotation(outQuat, worldTransform);
    }
    return true;
  }
  else {
    quat.identity(outQuat);
    return false;
  }
}

export function fixedAngleUnitVector2(out, theta) {
  vec2.set(out, Math.cos(theta), Math.sin(theta));
}

export function randomUnitVector2(out) {
  let a = randomRange(0, 2 * Math.PI);
  let x = Math.cos(a);
  let y = Math.sin(a);
  vec2.set(out, x, y);
}

export function randomUnitVector(out) {
  let z = randomRange(-1, 1);
  let a = randomRange(0, 2 * Math.PI);
  let r = Math.sqrt(1 - z * z);
  let x = r * Math.cos(a);
  let y = r * Math.sin(a);
  vec3.set(out, x, y, z);
}

export function randomPointInUnitSphere(out) {
  randomUnitVector(out);
  vec3.scale(out, random());
}

export function randomPointBetweenSphere(out, minRadius, maxRadius) {
  randomUnitVector(out);
  vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointInUnitCircle(out) {
  randomUnitVector2(out);
  vec3.scale(out, random());
}

export function randomPointBetweenCircle(out, minRadius, maxRadius) {
  randomUnitVector2(out);
  vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointBetweenCircleAtFixedAngle(out, minRadius, maxRadius, theta) {
  fixedAngleUnitVector2(out, theta);
  vec3.scale(out, out, minRadius + (maxRadius - minRadius) * random());
}

export function randomPointInCube(out, extents) {
  vec3.set(out,
    randomRange(-extents.x, extents.x),
    randomRange(-extents.y, extents.y),
    randomRange(-extents.z, extents.z));
}

export function randomPointBetweenCube(out, minBox, maxBox) {
  const subscript = ['x', 'y', 'z'];
  let edge = randomRangeInt(0, 3);
  for (let i = 0; i < 3; i++) {
    if (i === edge) {
      out[subscript[i]] = randomRange(-maxBox[subscript[i]], maxBox[subscript[i]]);
      continue;
    }
    let x = random() * 2 - 1;
    if (x < 0) {
      out[subscript[i]] = -minBox[subscript[i]] + x * (maxBox[subscript[i]] - minBox[subscript[i]]);
    }
    else {
      out[subscript[i]] = minBox[subscript[i]] + x * (maxBox[subscript[i]] - minBox[subscript[i]]);
    }
  }
}

// Fisher–Yates shuffle
export function randomSortArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    let transpose = i + randomRangeInt(0, arr.length - i);
    let val = arr[transpose];
    arr[transpose] = arr[i];
    arr[i] = val;
  }
}

export function randomSign() {
  let sgn = randomRange(-1, 1);
  sgn === 0 ? sgn++ : sgn;
  return sign(sgn);
}
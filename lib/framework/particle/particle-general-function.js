import { mat4, quat } from '../../vmath';

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
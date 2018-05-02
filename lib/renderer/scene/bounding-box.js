import { vec3 } from '../../vmath';

export default class BoundingBox {
  constructor(minPt, maxPt) {
    this._corners = new Array(8);
    this._corners[0] = vec3.new(minPt.x, minPt.y, minPt.z);
    this._corners[1] = vec3.new(maxPt.x, maxPt.y, maxPt.z);
    this._corners[2] = vec3.new(maxPt.x, minPt.y, minPt.z);
    this._corners[3] = vec3.new(minPt.x, maxPt.y, minPt.z);
    this._corners[4] = vec3.new(minPt.x, minPt.y, maxPt.z);
    this._corners[5] = vec3.new(minPt.x, maxPt.y, maxPt.z);
    this._corners[6] = vec3.new(maxPt.x, minPt.y, maxPt.z);
    this._corners[7] = vec3.new(maxPt.x, maxPt.y, minPt.z);
  }

  toWorldSpace(modelMat) {
    for (let i = 0; i < 8; ++i) {
      vec3.transformMat4(this._corners[i], this._corners[i], modelMat);
    }
  }

  isInFrustum(planes) {
    for (let p = 0; p < 6; ++p) {
      let inCount = 8;
      for (let i = 0; i < 8; ++i) {
        let dot = vec3.dot(planes[p].n, this._corners[i]);
        if (dot < planes[p].d) {
          --inCount;
        } else {
          break;
        }
        if (inCount === 0) {
          return false;
        }
      }
    }

    return true;
  }

}
import { vec3 } from '../../vmath';

export default class BoundingBox {
  constructor(minPt, maxPt) {
    this._localCorners = new Array(8);
    this._localCorners[0] = vec3.new(minPt.x, minPt.y, minPt.z);
    this._localCorners[1] = vec3.new(maxPt.x, maxPt.y, maxPt.z);
    this._localCorners[2] = vec3.new(maxPt.x, minPt.y, minPt.z);
    this._localCorners[3] = vec3.new(minPt.x, maxPt.y, minPt.z);
    this._localCorners[4] = vec3.new(minPt.x, minPt.y, maxPt.z);
    this._localCorners[5] = vec3.new(minPt.x, maxPt.y, maxPt.z);
    this._localCorners[6] = vec3.new(maxPt.x, minPt.y, maxPt.z);
    this._localCorners[7] = vec3.new(maxPt.x, maxPt.y, minPt.z);
    this._worldCorners = new Array(8);
    for (let i = 0; i < 8; ++i) {
      this._worldCorners[i] = vec3.create();
    }
  }

  toWorldSpace(modelMat) {
    for (let i = 0; i < 8; ++i) {
      vec3.transformMat4(this._worldCorners[i], this._localCorners[i], modelMat);
    }
  }

  isInFrustum(planes) {
    for (let p = 0; p < 6; ++p) {
      let inCount = 8;
      for (let i = 0; i < 8; ++i) {
        let dot = vec3.dot(planes[p].n, this._worldCorners[i]);
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
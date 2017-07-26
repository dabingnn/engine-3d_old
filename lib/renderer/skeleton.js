import { utils } from 'scene-graph';
import { mat4 } from 'vmath';

export default class Skeleton {
  constructor() {
    this._root = null;
    this._joints = null;
    this._matrices = null;
  }

  setRoot(root) {
    this._root = root;
    this._joints = utils.flat(this._root);
    this._matrices = new Array(this._joints.length);

    for (let i = 0; i < this._joints.length; ++i) {
      this._matrices[i] = mat4.create();
    }
    this.updateMatrices();
  }

  updateMatrices() {
    for (let i = 0; i < this._joints.length; ++i) {
      this._joints[i].getWorldMatrix(this._matrices[i]);
    }
  }

  getWorldMatrix(i) {
    return this._matrices[i];
  }

  clone() {
    let newSkeleton = new Skeleton();
    newSkeleton.setRoot(this._root.deepClone());

    return newSkeleton;
  }
}
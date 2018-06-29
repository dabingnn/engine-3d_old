import { mat4 } from '../vmath';
import ModelComponent from './model-component';
import renderer from '../renderer';
import utils from '../misc/utils';

let _m4_tmp = mat4.create();

export default class SkinningModelComponent extends ModelComponent {
  onInit() {
    this._models = [];
    // internal skinning data
    this._jointsTexture = null;
    this._refSkeleton = null;

    this._updateModels();
    this._updateCastShadow();
    this._updateReceiveShadow();

    let rootEnt = this._entity.parent;
    let animComp = rootEnt.getComp('Animation');
    if (animComp) {
      this._refSkeleton = animComp.skeleton;
    } else {
      console.warn('Can not find Animation component in root entity.');
    }

    this._system.add(this);
  }

  onDestroy() {
    this._system.remove(this);
  }

  _updateMatrices() {
    if (!this._mesh || !this._mesh.skinning) {
      return;
    }

    const texture = this._jointsTexture;
    const jointIndices = this._mesh.skinning.jointIndices;
    const bindposes = this._mesh.skinning.bindposes;

    for (let i = 0; i < jointIndices.length; ++i) {
      let bindpose = bindposes[i];
      let idx = jointIndices[i];

      let worldMatrix = this._refSkeleton.getWorldMatrix(idx);
      mat4.multiply(_m4_tmp, worldMatrix, bindpose);

      texture.data[16 * i + 0]  = _m4_tmp.m00;
      texture.data[16 * i + 1]  = _m4_tmp.m01;
      texture.data[16 * i + 2]  = _m4_tmp.m02;
      texture.data[16 * i + 3]  = _m4_tmp.m03;
      texture.data[16 * i + 4]  = _m4_tmp.m04;
      texture.data[16 * i + 5]  = _m4_tmp.m05;
      texture.data[16 * i + 6]  = _m4_tmp.m06;
      texture.data[16 * i + 7]  = _m4_tmp.m07;
      texture.data[16 * i + 8]  = _m4_tmp.m08;
      texture.data[16 * i + 9]  = _m4_tmp.m09;
      texture.data[16 * i + 10] = _m4_tmp.m10;
      texture.data[16 * i + 11] = _m4_tmp.m11;
      texture.data[16 * i + 12] = _m4_tmp.m12;
      texture.data[16 * i + 13] = _m4_tmp.m13;
      texture.data[16 * i + 14] = _m4_tmp.m14;
      texture.data[16 * i + 15] = _m4_tmp.m15;
    }

    texture.commit();
  }

  _updateModels() {
    if (this._mesh.skinning) {
      if (this._jointsTexture) {
        this._jointsTexture.unload();
        this._jointsTexture = null;
      }

      this._jointsTexture = utils.createJointsTexture(
        this._app,
        this._mesh.skinning
      );
    }

    let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
    let oldModels = this._models;

    this._models = new Array(meshCount);
    for (let i = 0; i < meshCount; ++i) {
      let model = new renderer.SkinningModel();
      model.createBoundingBox(this._mesh._minPos, this._mesh._maxPos);
      this._models[i] = model;
    }

    this. _updateModelParams();

    if (this.enabled) {
      this._entity.emit('skinning-model-changed', this, 'mesh', oldModels);
    }
  }

  _updateModelParams() {
    super._updateModelParams();
    for (let i = 0; i < this._models.length; ++i)
      this._models[i].setJointsTexture(this._jointsTexture._texture);
  }
}

import { mat4 } from '../vmath';
import { Component } from '../ecs';
import renderer from '../renderer';
import utils from '../misc/utils';

let _m4_tmp = mat4.create();

export default class SkinningModelComponent extends Component {
  onInit() {
    // internal skinning data
    this._models = [];
    this._jointsTexture = null;
    this._refSkeleton = null;

    this._updateModels();

    //
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

  onEnable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.addModel(this._models[i]);
    }
  }

  onDisable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.removeModel(this._models[i]);
    }
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

  getMaterial(idx) {
    if (this._materials.length === 0) {
      return null;
    }

    if (idx < this._materials.length) {
      return this._materials[idx];
    }

    return this._materials[this._materials.length - 1];
  }

  get material() {
    return this.getMaterial(0);
  }
  set material(val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials[0] = val;

    if (this._models.length > 0) {
      this._models[0].setEffect(val.effectInst);
    }
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
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models[i];
      let material = this.getMaterial(i);

      model.setInputAssembler(this._mesh.getSubMesh(i));
      model.setEffect(material ? material.effectInst : null);
      model.setNode(this._entity);
      model.setJointsTexture(this._jointsTexture._texture);
    }
  }
}

SkinningModelComponent.schema = {
  materials: {
    type: 'asset',
    default: [],
    array: true,
  },

  mesh: {
    type: 'asset',
    default: null,
    set (val) {
      if (this._mesh === val) {
        return;
      }

      this._mesh = val;
      this._updateModels();
    }
  },
};
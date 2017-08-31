import { Component } from 'ecs.js';
import SkinningModel from '../renderer/skinning-model';
import utils from '../misc/utils';

export default class SkinningModelComponent extends Component {
  constructor() {
    super();

    this._materials = []; // [Material]
    this._mesh = null; // Mesh
    this._model = new SkinningModel();
  }

  onInit() {
    this._model.setNode(this._entity);

    // TODO:
    // let rootEnt = this._entity.parent;
    // let animComp = rootEnt.getComp('Animation');
    // if (animComp) {
    //   this._model.setSkeleton(animComp._skeleton);
    // } else {
    //   console.warn('Can not find Animation component in root entity.');
    // }
  }

  set material(val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials.length = 1;
    this._materials[0] = val;
    this._model.clearEffects();
    this._model.addEffect(val._effect);
  }

  set mesh(val) {
    if (this._mesh !== val) {
      if (this._mesh) {
        this._model.clearMeshes();
      }

      this._mesh = val;

      for (let i = 0; i < this._mesh.subMeshCount; ++i) {
        this._model.addMesh(this._mesh.getSubMesh(i));
      }

      if (this._mesh.skinning) {
        let texture = utils.createJointsTexture(this._engine.device, this._skinning);

        this._model.setJointsTexture(texture);
        this._model.setSkinning(this._mesh.skinning);
      }
    }
  }
}
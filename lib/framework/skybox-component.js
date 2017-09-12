import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import utils from '../misc/utils';
import { box } from 'primitives.js';
import SkyboxMaterial from '../materials/skybox-material';
import enums from '../enums';

export default class SkyboxComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._mesh = null; // Mesh
    this._model = new renderer.Model();
    this._cubeMap = null;
  }

  onInit() {
    this._model.setNode(this._entity);
    this._mesh = utils.createMesh(this._engine, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    let material = this._material = new SkyboxMaterial();
    material.blendType = enums.BLEND_NONE;
  }

  set cubeMap(val) {
    if (this._cubeMap === val) {
      return;
    }
    let material = this._material;
    if (this._cubeMap === null) {
      for (let i = 0; i < this._mesh.subMeshCount; ++i) {
        this._model.addMesh(this._mesh.getSubMesh(i));
      }
      this._model.addEffect(material._effect);
    }
    material.cubeMap = val;
    if (val === null) {
      this._model.clearEffects();
      this._model.clearMeshes();
    }
  }
}
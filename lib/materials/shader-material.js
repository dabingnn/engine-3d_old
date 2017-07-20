import renderer from 'renderer.js';
import Material from '../assets/material';

export default class ShaderMaterial extends Material {
  /**
   * @param {string} name
   * @param {Array} parameters
   * @param {Object} values
   */
  constructor(name, parameters = [], values = {}) {
    super(false);

    let mainTech = new renderer.Technique(
      renderer.STAGE_OPAQUE,
      parameters,
      [
        new renderer.Pass(name)
      ]
    );
    this._effect = new renderer.Effect([mainTech], values);
    this._mainTech = mainTech;
  }

  setStages(stages) {
    this._mainTech.stages = stages;
  }

  setDepth(depthTest, depthWrite) {
    this._mainTech.passes[0].setDepth(depthTest, depthWrite);
  }

  setValue(name, val) {
    this._effect.setValue(name, val);
  }

  setOption(name, val) {
    this._effect.setOption(name, val);
  }
}
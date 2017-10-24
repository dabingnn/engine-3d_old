import renderer from 'renderer.js';
import Material from '../assets/material';
import Texture from '../assets/texture';

export default class ShaderMaterial extends Material {
  /**
   * @param {string} name
   * @param {Array} parameters
   * @param {Object} values
   */
  constructor(name, parameters = [], options = []) {
    super();

    let mainTech = new renderer.Technique(
      ['opaque'],
      parameters,
      [new renderer.Pass(name)]
    );
    this._effect = new renderer.Effect([mainTech], {}, options);
    this._mainTech = mainTech;
  }

  setStages(stages) {
    this._mainTech.setStages(stages);
  }

  setDepth(depthTest, depthWrite) {
    this._mainTech.passes[0].setDepth(depthTest, depthWrite);
  }

  setValue(name, val) {
    if (val instanceof Texture) {
      this._effect.setValue(name, val._texture);
    } else {
      this._effect.setValue(name, val);
    }
  }

  setOption(name, val) {
    this._effect.setOption(name, val);
  }
}
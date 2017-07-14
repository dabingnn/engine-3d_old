import renderer from 'renderer.js';
const { Pass, Technique, Material } = renderer;

export default class ShaderMaterial extends Material {
  /**
   * @param {string} name
   * @param {Array} parameters
   * @param {Object} values
   */
  constructor(name, parameters = [], values = {}) {
    let mainTech = new Technique(
      renderer.STAGE_OPAQUE,
      parameters,
      [
        new Pass(name)
      ]
    );

    super([mainTech], values);
    this._mainTech = mainTech;
  }

  setStages (stages) {
    this._mainTech.stages = stages;
  }

  setDepth( depthTest, depthWrite ) {
    this._mainTech.passes[0].setDepth(depthTest, depthWrite);
  }
}
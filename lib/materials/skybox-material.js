import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Material from '../assets/material';

export default class SkyboxMaterial extends Material {
  constructor() {
    super();
    let pass = new renderer.Pass('skybox');
    pass.setCullMode(gfx.CULL_NONE);
    // TODO: use layer -1 to make it render first, change it to enums later
    let mainTech = new renderer.Technique(
      renderer.STAGE_OPAQUE,
      [
        { name: 'cubeMap', type: renderer.PARAM_TEXTURE_CUBE },
      ],
      [
        pass
      ],
      -1
    );

    this._effect = new renderer.Effect([mainTech]);
    // skybox state: opaque stage, do not do blend, depth test and depth write
    mainTech.stages = renderer.STAGE_OPAQUE;
    pass._blend = false;
    pass.setDepth(false, false);
    this._cubeMap = null;
  }

  set cubeMap(val) {
    if (this._cubeMap === val) {
      return;
    }
    this._cubeMap = val;
    this._effect.setValue('cubeMap', val && val._texture);
  }
}
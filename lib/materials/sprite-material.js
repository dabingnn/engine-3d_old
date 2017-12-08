import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Material from '../assets/material';
import { color4 } from 'vmath';

export default class SpriteMaterial extends Material {
  constructor() {
    super();

    let mainTech = new renderer.Technique(
      ['2d'],
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
      ],
      [new renderer.Pass('sprite')]
    );
    let pass = mainTech.passes[0];
    pass.setDepth(true, false);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_ONE, gfx.BLEND_ONE
    );

    this._effect = new renderer.Effect(
      [
        mainTech,
      ],
      {
        color: color4.new(1, 1, 1, 1),
      },
      [
      ]
    );
    this._mainTech = mainTech;
    this._mainTexture = null;
  }

  set mainTexture(val) {
    this._mainTexture = val;
    this._effect.setValue('mainTexture', val._texture);
  }
}
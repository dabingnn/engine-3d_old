import renderer from 'renderer.js';
import Material from '../assets/material';
import { color4 } from 'vmath';

export default class SpriteMaterial extends Material {
  constructor() {
    super();

    let mainTech = new renderer.Technique(
      renderer.STAGE_2D,
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4, },
      ],
      [
        new renderer.Pass('sprite')
      ]
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

  set color(val) {
    this._effect.setValue('color', val);
  }

  set mainTexture(val) {
    this._mainTexture = val;
    this._effect.setValue('mainTexture', val._texture);
  }
}
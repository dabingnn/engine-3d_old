import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Material from '../assets/material';
import enums from '../enums';
import { color4 } from 'vmath';

export default class UnlitMaterial extends Material {
  constructor() {
    super();

    let mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4, },
      ],
      [new renderer.Pass('unlit')]
    );

    // let shadowTech = new Technique(
    //   renderer.STAGE_SHADOW,
    //   [
    //   ],
    //   [
    //     new Pass('shadow')
    //   ]
    // );

    this._effect = new renderer.Effect(
      [
        mainTech,
        // shadowTech
      ],
      {
        color: color4.new(1, 1, 1, 1),
      },
      [
        { name: 'USE_TEXTURE', value: false },
        { name: 'USE_COLOR', value: false },
      ]
    );
    this._mainTech = mainTech;
    this._mainTexture = null;
    this.blendType = enums.BLEND_NONE;
  }

  get blendType () {
    return this._blendType;
  }
  set blendType (val) {
    if (this._blendType === val) {
      return;
    }

    let pass = this._mainTech.passes[0];
    this._blendType = val;

    if (val === enums.BLEND_NONE) {
      this._mainTech.setStages(['opaque']);
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums.BLEND_NORMAL) {
      this._mainTech.setStages(['transparent']);
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ONE
      );
    }
  }

  set useColor(val) {
    this._effect.setOption('USE_COLOR', val);
  }

  set useTexture(val) {
    this._effect.setOption('USE_TEXTURE', val);
  }

  set color(val) {
    this._effect.setValue('color', val);
  }

  set mainTexture(val) {
    this._mainTexture = val;
    this._effect.setValue('mainTexture', val._texture);
  }
}
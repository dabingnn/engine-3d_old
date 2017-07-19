import gfx from 'gfx.js';
import renderer from 'renderer.js';
import enums from '../enums';

const { Pass, Technique, Material } = renderer;

export default class StandardMaterial extends Material {
  constructor(values = {}) {
    let mainTech = new Technique(
      renderer.STAGE_OPAQUE,
      [
        { name: 'mainTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'color', type: renderer.PARAM_COLOR4, },
      ],
      [
        new Pass('standard')
      ]
    );
    // let shadowTech = new Technique(
    //   renderer.STAGE_SHADOW,
    //   [
    //   ],
    //   [
    //     new Pass('shadow')
    //   ]
    // );

    super(
      [
        mainTech,
        // shadowTech
      ],
      values,
      {
        useTexture: false,
        useSkinning: false,
        useColor: false,
      }
    );

    this._mainTech = mainTech;
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
      this._mainTech.stages = renderer.STAGE_OPAQUE;
      pass._blend = false;
      pass.setDepth(true, true);
    } else if (val === enums.BLEND_NORMAL) {
      this._mainTech.stages = renderer.STAGE_TRANSPARENT;
      pass.setDepth(true, false);
      pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ONE
      );
    }
  }
}
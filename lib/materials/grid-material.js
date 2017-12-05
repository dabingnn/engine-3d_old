import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Material from '../assets/material';
import enums from '../enums';
import { vec2, color3, color4 } from 'vmath';

export default class GridMaterial extends Material {
  constructor() {
    super();

    let mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'tiling', type: renderer.PARAM_FLOAT2 },
        { name: 'baseColorWhite', type: renderer.PARAM_COLOR3 },
        { name: 'baseColorBlack', type: renderer.PARAM_COLOR3 },
        { name: 'basePattern', type: renderer.PARAM_TEXTURE_2D },
        { name: 'basePatternTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'basePatternOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternColor', type: renderer.PARAM_COLOR4 },
        { name: 'subPattern', type: renderer.PARAM_TEXTURE_2D },
        { name: 'subPatternTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'subPatternColor2', type: renderer.PARAM_COLOR4 },
        { name: 'subPattern2', type: renderer.PARAM_TEXTURE_2D },
        { name: 'subPattern2Tiling', type: renderer.PARAM_FLOAT2 },
        { name: 'subPattern2Offset', type: renderer.PARAM_FLOAT2 },
      ],
      [new renderer.Pass('grid')]
    );

    this._effect = new renderer.Effect(
      [
        mainTech,
      ],
      {
      },
      [
        { name: 'USE_WORLD_POS', value: false },
      ]
    );

    this._mainTech = mainTech;
    this._basePattern = null;
    this._subPattern = null;
    this._subPattern2 = null;

    this.tiling = vec2.new(1,1);

    this.baseColorWhite = color3.new(1,1,1);
    this.baseColorBlack = color3.new(0,0,0);
    this.basePatternTiling = vec2.new(1,1);
    this.basePatternOffset = vec2.new(0,0);

    this.subPatternColor = color4.new(1,1,1,1);
    this.subPatternTiling = vec2.new(1,1);
    this.subPatternOffset = vec2.new(0,0);

    this.subPatternColor2 = color4.new(1,1,1,1);
    this.subPattern2Tiling = vec2.new(1,1);
    this.subPattern2Offset = vec2.new(0,0);

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

  set useWorldPos(val) {
    this._effect.setOption('USE_WORLD_POS', val);
  }

  set tiling(val) {
    this._effect.setValue('tiling', val);
  }

  set baseColorWhite(val) {
    this._effect.setValue('baseColorWhite', val);
  }

  set baseColorBlack(val) {
    this._effect.setValue('baseColorBlack', val);
  }

  set basePattern(val) {
    this._basePattern = val;
    this._effect.setValue('basePattern', val._texture);
  }

  set basePatternTiling(val) {
    this._effect.setValue('basePatternTiling', val);
  }

  set basePatternOffset(val) {
    this._effect.setValue('basePatternOffset', val);
  }

  set subPatternColor(val) {
    this._effect.setValue('subPatternColor', val);
  }

  set subPattern(val) {
    this._subPattern = val;
    this._effect.setValue('subPattern', val._texture);
  }

  set subPatternTiling(val) {
    this._effect.setValue('subPatternTiling', val);
  }

  set subPatternOffset(val) {
    this._effect.setValue('subPatternOffset', val);
  }

  set subPatternColor2(val) {
    this._effect.setValue('subPatternColor2', val);
  }

  set subPattern2(val) {
    this._subPattern2 = val;
    this._effect.setValue('subPattern2', val._texture);
  }

  set subPattern2Tiling(val) {
    this._effect.setValue('subPattern2Tiling', val);
  }

  set subPattern2Offset(val) {
    this._effect.setValue('subPattern2Offset', val);
  }
}
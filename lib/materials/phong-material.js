import gfx from 'gfx.js';
import renderer from 'renderer.js';
import enums from '../enums';
import Material from '../assets/material';
import { vec2, color3 } from 'vmath';

export default class PhongMaterial extends Material {
  constructor() {
    super();
    let mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'diffuseColor', type: renderer.PARAM_COLOR3 },
        { name: 'diffuseTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'emissiveColor', type: renderer.PARAM_COLOR3 },
        { name: 'emissiveTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'specularColor', type: renderer.PARAM_COLOR3 },
        { name: 'specularTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'glossiness', type: renderer.PARAM_FLOAT },
        { name: 'opacity', type: renderer.PARAM_FLOAT },
        { name: 'opacityTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'normalTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaTestThreshold', type: renderer.PARAM_FLOAT },
        { name: 'diffuseTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'diffuseOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'emissiveTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'emissiveOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'opacityOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'specularTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'specularOffset', type: renderer.PARAM_FLOAT2 },
        { name: 'normalMapTiling', type: renderer.PARAM_FLOAT2 },
        { name: 'normalMapOffset', type: renderer.PARAM_FLOAT2 }
      ],
      [new renderer.Pass('phong')]
    );

    let passShadow = new renderer.Pass('shadow-depth');
    passShadow.setDepth(true,true);
    passShadow.setCullMode(gfx.CULL_BACK);
    let shadowTech = new renderer.Technique(
      ['shadowcast'],
      [
        //{ name: 'shadowMap', type: renderer.PARAM_TEXTURE_2D },
      ],
      [passShadow]
    );

    this._effect = new renderer.Effect(
      [
        mainTech,
        shadowTech
      ],
      {},
      [
        { name: 'USE_NORMAL', value: true },
        { name: 'USE_NORMAL_TEXTURE', value: false },
        { name: 'USE_DIFFUSE', value: true },
        { name: 'USE_DIFFUSE_TEXTURE', value: false },
        { name: 'USE_EMISSIVE', value: false },
        { name: 'USE_EMISSIVE_TEXTURE', value: false },
        { name: 'USE_SPECULAR', value: false },
        { name: 'USE_SPECULAR_TEXTURE', value: false },
        { name: 'USE_OPACITY', value: false },
        { name: 'USE_OPACITY_TEXTURE', value: false },
        { name: 'USE_ALPHA_TEST', value: false },
        { name: 'USE_SHADOW_MAP', value: true },
      ]
    );

    this._mainTech = mainTech;
    this._diffuseTexture = null;
    this._emissiveTexture = null;
    this._opacityTexture = null;
    this._specularTexture = null;
    this._normalTexture = null;

    this.blendType = enums.BLEND_NONE;
    this.diffuseColor = color3.new(0.8, 0.8, 0.8);
    this.emissiveColor = color3.create();

    this.opacity = 1.0;
    this.alphaTestThreshold = 0.0;

    this.specularColor = color3.create();
    this.glossiness = 10.0;
    this.diffuseTiling = vec2.new(1, 1);
    this.specularTiling = vec2.new(1, 1);
    this.emissiveTiling = vec2.new(1, 1);
    this.opacityTiling = vec2.new(1, 1);
    this.normalTiling = vec2.new(1, 1);

    this.diffuseOffset = vec2.new(0, 0);
    this.specularOffset = vec2.new(0, 0);
    this.emissiveOffset = vec2.new(0, 0);
    this.opacityOffset = vec2.new(0, 0);
    this.normalOffset = vec2.new(0, 0);
  }

  get blendType() {
    return this._blendType;
  }
  set blendType(val) {
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

  set diffuseColor(val) {
    this._effect.setValue('diffuseColor', val);
  }

  set diffuseTexture(val) {
    this._diffuseTexture = val;
    this._effect.setValue('diffuseTexture', val._texture);
  }

  set diffuseTiling(val) {
    this._effect.setValue('diffuseTiling', val);
  }

  set diffuseOffset(val) {
    this._effect.setValue('diffuseOffset', val);
  }

  set useDiffuseTexture(val) {
    this._effect.setOption('USE_DIFFUSE_TEXTURE', val);
  }

  set emissiveColor(val) {
    this._effect.setValue('emissiveColor', val);
  }

  set emissiveTexture(val) {
    this._emissiveTexture = val;
    this._effect.setValue('emissiveTexture', val._texture);
  }

  set emissiveTiling(val) {
    this._effect.setValue('emissiveTiling', val);
  }

  set emissiveOffset(val) {
    this._effect.setValue('emissiveOffset', val);
  }

  set useEmissive(val) {
    this._effect.setOption('USE_EMISSIVE', val);
  }

  set useEmissiveTexture(val) {
    this._effect.setOption('USE_EMISSIVE_TEXTURE', val);
    if (val === true) {
      this.useEmissive = val;
    }
  }

  set opacity(val) {
    this._effect.setValue('opacity', val);
  }

  set opacityTexture(val) {
    this._opacityTexture = val;
    this._effect.setValue('opacityTexture', val._texture);
  }

  set opacityTiling(val) {
    this._effect.setValue('opacityTiling', val);
  }

  set opacityOffset(val) {
    this._effect.setValue('opacityOffset', val);
  }

  set useOpacity(val) {
    this._effect.setOption('USE_OPACITY', val);
  }

  set useOpacityTexture(val) {
    this._effect.setOption('USE_OPACITY_TEXTURE', val);
    if (val === true) {
      this.useOpacity = val;
    }
  }

  set alphaTestThreshold(val) {
    this._effect.setValue('alphaTestThreshold', val);
  }

  set useAlphaTest(val) {
    this._effect.setOption('USE_ALPHATEST', val);
  }

  set useSpecular(val) {
    this._effect.setOption('USE_SPECULAR', val);
  }

  set useSpecularTexture(val) {
    this._effect.setOption('USE_SPECULAR_TEXTURE', val);
  }

  set specularColor(val) {
    this._effect.setValue('specularColor', val);
  }

  set glossiness(val) {
    this._effect.setValue('glossiness', val);
  }

  set specularTexture(val) {
    this._specularTexture = val;
    this._effect.setValue('specularTexture', val._texture);
  }

  set specularTiling(val) {
    this._effect.setValue('specularTiling', val);
  }

  set specularOffset(val) {
    this._effect.setValue('specularOffset', val);
  }

  set useNormalTexture(val) {
    this._effect.setOption('USE_NORMAL_TEXTURE', val);
  }

  set normalTexture(val) {
    this._normalTexture = val;
    this._effect.setValue('normalTexture', val._texture);
  }

  set normalTiling(val) {
    this._effect.setValue('normalMapTiling', val);
  }

  set normalOffset(val) {
    this._effect.setValue('normalMapOffset', val);
  }

  set useShadowMap(val) {
    this._effect.setOption('USE_SHADOWMAP', val);
  }
}
import gfx from 'gfx.js';
import renderer from 'renderer.js';
import enums from '../enums';
import Material from '../assets/material';
import { vec2, vec3, color3 } from 'vmath';

const { Pass, Technique } = renderer;

export default class PhongMaterial extends Material {
  constructor(values = {}) {
    super();
    let mainTech = new Technique(
      renderer.STAGE_OPAQUE,
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
      [
        new Pass('phong')
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

    this._effect = new renderer.Effect(
      [
        mainTech,
        // shadowTech
      ],
      values,
      {
        useSkinning: false,
        useNormal: true,
        directionalLightSlots: [],
        pointLightSlots: [],
        spotLightSlots: [],
        useUV0: true,
        useDiffuse: true,
        useDiffuseTexture: false,
        useEmissive: false,
        useEmissiveTexture: false,
        useSpecular: false,
        useSpecularTexture: false,
        useNormalTexture: false,
        useOpacity: false,
        useOpacityTexture: false,
        useAlphaTest: false
      }
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
    this.diffuseUVTiling = vec2.new(1, 1);
    this.specularUVTiling = vec2.new(1, 1);
    this.emissiveUVTiling = vec2.new(1, 1);
    this.opacityUVTiling = vec2.new(1, 1);
    this.normalUVTiling = vec2.new(1, 1);

    this.diffuseUVOffset = vec2.new(0, 0);
    this.specularUVOffset = vec2.new(0, 0);
    this.emissiveUVOffset = vec2.new(0, 0);
    this.opacityUVOffset = vec2.new(0, 0);
    this.normalUVOffset = vec2.new(0, 0);
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

  set diffuseColor(val) {
    this._effect.setValue('diffuseColor', val);
  }

  set diffuseTexture(val) {
    this._diffuseTexture = val;
    this._effect.setValue('diffuseTexture', val._texture);
  }

  set diffuseUVTiling(val) {
    this._effect.setValue('diffuseTiling', val);
  }

  set diffuseUVOffset(val) {
    this._effect.setValue('diffuseOffset', val);
  }

  set useDiffuseTexture(val) {
    this._effect.setOption('useDiffuseTexture', val);
  }

  set emissiveColor(val) {
    this._effect.setValue('emissiveColor', val);
  }

  set emissiveTexture(val) {
    this._emissiveTexture = val;
    this._effect.setValue('emissiveTexture', val._texture);
  }

  set emissiveUVTiling(val) {
    this._effect.setValue('emissiveTiling', val);
  }

  set emissiveUVOffset(val) {
    this._effect.setValue('emissiveOffset', val);
  }

  set useEmissive(val) {
    this._effect.setOption('useEmissive', val);
  }

  set useEmissiveTexture(val) {
    this._effect.setOption('useEmissiveTexture', val);
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

  set opacityUVTiling(val) {
    this._effect.setValue('opacityTiling', val);
  }

  set opacityUVOffset(val) {
    this._effect.setValue('opacityOffset', val);
  }

  set useOpacity(val) {
    this._effect.setOption('useOpacity', val);
  }

  set useOpacityTexture(val) {
    this._effect.setOption('useOpacityTexture', val);
    if (val === true) {
      this.useOpacity = val;
    }
  }

  set alphaTestThreshold(val) {
    this._effect.setValue('alphaTestThreshold', val);
  }

  set useAlphaTest(val) {
    this._effect.setOption('useAlphaTest', val);
  }

  set useSpecular(val) {
    this._effect.setOption('useSpecular', val);
  }

  set useSpecularTexture(val) {
    this._effect.setOption('useSpecularTexture', val);
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

  set specularUVTiling(val) {
    this._effect.setValue('specularTiling', val);
  }

  set specularUVOffset(val) {
    this._effect.setValue('specularOffset', val);
  }

  set useNormalTexture(val) {
    this._effect.setOption('useNormalTexture', val);
  }

  set normalTexture(val) {
    this._normalTexture = val;
    this._effect.setValue('normalTexture', val._texture);
  }

  set normalUVTiling(val) {
    this._effect.setValue('normalMapTiling', val);
  }

  set normalUVOffset(val) {
    this._effect.setValue('normalMapOffset', val);
  }
}
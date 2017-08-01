import gfx from 'gfx.js';
import renderer from 'renderer.js';
import enums from '../enums';
import Material from '../assets/material';
import { vec3, color3 } from 'vmath';

const { Pass, Technique } = renderer;

export default class PhongMaterial extends Material {
  constructor(values = {}) {
    super();
    let mainTech = new Technique(
      renderer.STAGE_OPAQUE,
      [
        { name: 'diffuseValue', type: renderer.PARAM_COLOR3 },
        { name: 'diffuseTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'ambientValue', type: renderer.PARAM_COLOR3 },
        { name: 'ambientTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'emissiveValue', type: renderer.PARAM_COLOR3 },
        { name: 'emissiveTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'specularValue', type: renderer.PARAM_COLOR3 },
        { name: 'specularTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'glossinessValue', type: renderer.PARAM_FLOAT },
        { name: 'glossinessTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'opacityValue', type: renderer.PARAM_FLOAT },
        { name: 'opacityTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaTestRef', type: renderer.PARAM_FLOAT }
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
        useAmbient: false,
        useAmbientTexture: false,
        useEmissive: false,
        useEmissiveTexture: false,
        useSpecular: false,
        useSpecularTexture: false,
        useGlossinessTexture: false,
        useOpacity: false,
        useOpacityTexture: false,
        useAlphaTest: false
      }
    );

    this._mainTech = mainTech;
    this.blendType = enums.BLEND_NONE;
    this.diffuse = color3.new(0.8, 0.8, 0.8);
    this._emissive = color3.create();
    this._specular = color3.create();
    this._ambient = color3.create();
    this._glossiness = 10.0;
    this._opacity = 1.0;

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

  set diffuse(val) {
    this._effect.setValue('diffuseValue', val);
  }

  set diffuseTexture(val) {
    this._effect.setValue('diffuseTexture', val);
  }

  set useDiffuseTexture(val) {
    this._effect.setOption('useDiffuseTexture', val);
  }

  set ambient(val) {
    this._effect.setValue('ambientValue', val);
  }

  set ambientTexture(val) {
    this._effect.setValue('ambientTexture', val);
  }

  set useAmbient(val) {
    this._effect.setOption('useAmbient', val);
  }

  set useAmbientTexture(val) {
    this._effect.setOption('useAmbientTexture', val);
    if (val === true) {
      this.useAmbient = val;
    }
  }

  set emissive(val) {
    this._effect.setValue('emissiveValue', val);
  }

  set emissiveTexture(val) {
    this._effect.setValue('emissiveTexture', val);
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
    this._effect.setValue('opacityValue', val);
  }

  set opacityTexture(val) {
    this._effect.setValue('opacityTexture', val);
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

  set alphaTestRef(val) {
    this._effect.setValue('alphaTestRef', val);
  }

  set useAlphaTest(val) {
    this._effect.setOption('useAlphaTest', val);
  }
}
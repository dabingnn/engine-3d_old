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
        { name: 'diffuseColor', type: renderer.PARAM_COLOR3 },
        { name: 'diffuseTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'emissiveColor', type: renderer.PARAM_COLOR3 },
        { name: 'emissiveTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'specularColor', type: renderer.PARAM_COLOR3 },
        { name: 'specularTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'glossiness', type: renderer.PARAM_FLOAT },
        { name: 'opacity', type: renderer.PARAM_FLOAT },
        { name: 'opacityTexture', type: renderer.PARAM_TEXTURE_2D },
        { name: 'alphaTestThreshold', type: renderer.PARAM_FLOAT }
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
        useOpacity: false,
        useOpacityTexture: false,
        useAlphaTest: false
      }
    );

    this._mainTech = mainTech;
    this.blendType = enums.BLEND_NONE;
    this.diffuseColor = color3.new(0.8, 0.8, 0.8);
    this.emissiveColor = color3.create();

    this.opacity = 1.0;
    this.alphaTestThreshold = 0.0;

    this.specularColor = color3.create();
    this.glossiness = 10.0;
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
    this._effect.setValue('diffuseTexture', val);
  }

  set useDiffuseTexture(val) {
    this._effect.setOption('useDiffuseTexture', val);
  }
  
  set emissiveColor(val) {
    this._effect.setValue('emissiveColor', val);
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
    this._effect.setValue('opacity', val);
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
    this._effect.setValue('specularTexture', val);
  }

}
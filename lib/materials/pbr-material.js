import renderer from 'renderer.js';
import Material from '../assets/material';
import { vec2, color3 } from 'vmath';

export default class PbrMaterial extends Material {
  constructor() {
    super();
    let pass = new renderer.Pass('pbr');
    pass.setDepth(true,true);

    let mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'albedo', type: renderer.PARAM_COLOR3},
        { name: 'albedoTiling', type: renderer.PARAM_FLOAT2},
        { name: 'albedoOffset', type: renderer.PARAM_FLOAT2},
        { name: 'albedoTexture', type: renderer.PARAM_TEXTURE_2D},
        { name: 'metalRoughnessTiling', type: renderer.PARAM_FLOAT2},
        { name: 'metalRoughnessOffset', type: renderer.PARAM_FLOAT2},
        { name: 'metallic', type: renderer.PARAM_FLOAT},
        { name: 'metallicTiling', type: renderer.PARAM_FLOAT2},
        { name: 'metallicOffset', type: renderer.PARAM_FLOAT2},
        { name: 'metallicTexture', type: renderer.PARAM_TEXTURE_2D},
        { name: 'roughness', type: renderer.PARAM_FLOAT},
        { name: 'roughnessTiling', type: renderer.PARAM_FLOAT2},
        { name: 'roughnessOffset', type: renderer.PARAM_FLOAT2},
        { name: 'roughnessTexture', type: renderer.PARAM_TEXTURE_2D},
        { name: 'ao', type: renderer.PARAM_FLOAT},
        { name: 'aoTiling', type: renderer.PARAM_FLOAT2},
        { name: 'aoOffset', type: renderer.PARAM_FLOAT2},
        { name: 'aoTexture', type: renderer.PARAM_TEXTURE_2D},
        { name: 'normalMapTiling', type: renderer.PARAM_FLOAT2},
        { name: 'normalMapOffset', type: renderer.PARAM_FLOAT2},
        { name: 'normalTexture', type: renderer.PARAM_TEXTURE_2D},
        { name: 'diffuseEnvTexture', type: renderer.PARAM_TEXTURE_CUBE},
        { name: 'specularEnvTexture', type: renderer.PARAM_TEXTURE_CUBE},
        { name: 'brdfLUT', type: renderer.PARAM_TEXTURE_2D},
        { name: 'maxReflectionLod', type: renderer.PARAM_FLOAT},
      ],
      [pass]
    );
    // TODO: add blend type?
    this._effect = new renderer.Effect(
      [mainTech],
      {},
      [
        { name: 'useNormal', value: true },
        { name: 'useUV0', value: true },
        { name: 'useSkinning', value: false },
        { name: 'useNormalTexture', value: true },
        { name: 'useAlbedoTexture', value: true },
        { name: 'useMetalRoughnessTexture', value: false},
        { name: 'useMetallicTexture', value: true },
        { name: 'useRoughnessTexture', value: true },
        { name: 'useAoTexture', value: true },
        { name: 'useIBL', value: true},
        { name: 'useTexLod', value: true},
      ]
    );

    this._mainTech = mainTech;
    this._normalTexture = null;
    this._albedoTexture = null;
    this._metallicTexture = null;
    this._roughnessTexture = null;
    this._diffuseEnvTexture = null;
    this._specularEnvTexture = null;
    this._brdfLUT = null;

    this.albedo = color3.new(0.8, 0.8, 0.8);
    this.metallic = 1.0;
    this.roughness = 0.5;
    this.ao = 0.2;

    this.albedoUVTiling = vec2.new(1, 1);
    this.metalRoughnessTiling = vec2.new(1, 1);
    this.metallicUVTiling = vec2.new(1, 1);
    this.roughnessUVTiling = vec2.new(1, 1);
    this.aoUVTiling = vec2.new(1, 1);
    this.normalUVTiling = vec2.new(1, 1);

    this.albedoUVOffset = vec2.new(0, 0);
    this.metalRoughnessOffset = vec2.new(0, 0);
    this.metallicUVOffset = vec2.new(0, 0);
    this.roughnessUVOffset = vec2.new(0, 0);
    this.aoUVOffset = vec2.new(0, 0);
    this.normalUVOffset = vec2.new(0, 0);

    this.maxReflectionLod = 9.0;
  }

  set albedo(val) {
    this._effect.setValue('albedo', val);
  }

  set albedoTexture(val) {
    this._albedoTexture = val;
    this._effect.setValue('albedoTexture', val._texture);
  }

  set albedoUVTiling(val) {
    this._effect.setValue('albedoTiling', val);
  }

  set albedoUVOffset(val) {
    this._effect.setValue('albedoOffset', val);
  }

  set useAlbedoTexture(val) {
    this._effect.setOption('useAlbedoTexture', val);
  }

  set metallic(val) {
    this._effect.setValue('metallic', val);
  }

  set metallicTexture(val) {
    this._metallicTexture = val;
    this._effect.setValue('metallicTexture', val._texture);
  }

  set metallicUVTiling(val) {
    this._effect.setValue('metallicTiling', val);
  }

  set metallicUVOffset(val) {
    this._effect.setValue('metallicOffset', val);
  }

  set useMetallicTexture(val) {
    this._effect.setOption('useMetallicTexture', val);
  }

  set roughness(val) {
    this._effect.setValue('roughness', val);
  }

  set roughnessTexture(val) {
    this._roughnessTexture = val;
    this._effect.setValue('roughnessTexture', val._texture);
  }

  set roughnessUVTiling(val) {
    this._effect.setValue('roughnessTiling', val);
  }

  set roughnessUVOffset(val) {
    this._effect.setValue('roughnessOffset', val);
  }

  set useRoughnessTexture(val) {
    this._effect.setOption('useRoughnessTexture', val);
  }

  set ao(val) {
    this._effect.setValue('ao', val);
  }

  set aoTexture(val) {
    this._aoTexture = val;
    this._effect.setValue('aoTexture', val._texture);
  }

  set aoUVTiling(val) {
    this._effect.setValue('aoTiling', val);
  }

  set aoUVOffset(val) {
    this._effect.setValue('aoOffset', val);
  }

  set useAoTexture(val) {
    this._effect.setOption('useAoTexture', val);
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

  set useNormalTexture(val) {
    this._effect.setOption('useNormalTexture', val);
  }

  set diffuseEnvTexture(val) {
    this._diffuseEnvTexture = val;
    this._effect.setValue('diffuseEnvTexture', val._texture);
  }

  set specularEnvTexture(val) {
    this._specularEnvTexture = val;
    this._effect.setValue('specularEnvTexture', val._texture);
  }

  set brdfLUT(val) {
    this._brdfLUT = val;
    this._effect.setValue('brdfLUT', val._texture);
  }

  set useIBL(val) {
    this._effect.setOption('useIBL', val);
  }

  set useTexLod(val) {
    // TODO: check whether EXT_shader_texture_lod is valid.
    this._effect.setOption('useTexLod', val);
  }

  set maxReflectionLod(val) {
    this._effect.setValue('maxReflectionLod', val);
  }
}
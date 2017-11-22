import gfx from 'gfx.js';
import renderer from 'renderer.js';
import { color4, mat4 } from 'vmath';

export default class ShadowMap {
  constructor(device) {
    this._device = device;
    this._shadowView = new renderer.View();
    this._light = null;
    this._a16_viewProj = new Float32Array(16);
    this._shadowFrameBuffer = null;
    this._shadowTexture = null;
    this._shadowDepth = null;
    this._shadowWidth = 1024;
    this._shadowHeight = 1024;
    this._generateShadow = false;
    this._enableBlur = true;
  }

  setupShadowMap(light) {
    this._light = light;
    this._shadowWidth = this._light.shadowResolution;
    this._shadowHeight = this._light.shadowResolution;
    this._generateShadow = true;
    if (light.shadowType === renderer.SHADOW_HARD) {
      this._enableBlur = false;
    }
    if (!this._shadowFrameBuffer) {
      this._shadowTexture = new gfx.Texture2D(this._device, {
        width: this._shadowWidth,
        height: this._shadowHeight,
        format: gfx.TEXTURE_FMT_RGBA8,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
      });
      this._shadowDepth = new gfx.RenderBuffer(this._device,
        gfx.RB_FMT_D16,
        this._shadowWidth,
        this._shadowHeight
      );
      this._shadowFrameBuffer = new gfx.FrameBuffer(this._device, this._shadowWidth, this._shadowHeight, {
        colors: [this._shadowTexture],
        depth: this._shadowDepth,
      });
    }
  }

  beginShadowMap() {
    this._device.setFrameBuffer(this._shadowFrameBuffer);
    this._device.setViewport(0, 0, this._shadowWidth, this._shadowHeight);
    this._device.clear({
      color: [1, 1, 1, 1]
    });
  }

  endShadowMap() {
    this._device.setFrameBuffer(null);
  }

  getShadowView(camera) {
    this._shadowView._color = color4.new(1, 1, 1, 1);
    this._shadowView._stages = ['shadowcast'];
    this._shadowView._depth = 1;
    this._shadowView._clearFlags = renderer.CLEAR_DEPTH;
    this._shadowView._rect.w = this._shadowWidth;
    this._shadowView._rect.h = this._shadowHeight;
    this._shadowView._matViewProj = this._light.computeLightViewProjMatrix(camera);
    return this._shadowView;
  }

  getShadowMap() {
    return this._shadowTexture;
  }

  getViewProjMat() {
    mat4.array(this._a16_viewProj, this._shadowView._matViewProj);
    return this._a16_viewProj;
  }

  submitShadowStageUniform() {
    this._device.setUniform('minDepth', this._light.shadowMinDepth);
    this._device.setUniform('maxDepth', this._light.shadowMaxDepth);
    this._device.setUniform('bias', this._light.shadowBias);
    this._device.setUniform('depthScale', this._light.shadowDepthScale);
  }

  submitOtherStageUniform() {
    this._device.setUniform('minDepth', this._light.shadowMinDepth);
    this._device.setUniform('maxDepth', this._light.shadowMaxDepth);
    this._device.setUniform('darkness', this._light.shadowDarkness);
    this._device.setUniform('depthScale', this._light.shadowDepthScale);
    this._device.setUniform('frustumEdgeFalloff', this._light.frustumEdgeFalloff);
    this._device.setUniform('bias', this._light.shadowBias);
    this._device.setUniform('texelSize', new Float32Array([1.0 / this._shadowWidth, 1.0 / this._shadowHeight]));
  }

  get enableBlur() {
    return this._enableBlur;
  }
  set enableBlur(val) {
    this._enableBlur = val;
  }

  get generateShadow() {
    return this._generateShadow;
  }

}
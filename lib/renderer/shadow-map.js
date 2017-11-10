import gfx from 'gfx.js';
import renderer from 'renderer.js';
//import enums from '../enums';
import { vec3, mat4 } from 'vmath';

export default class ShadowMap {
  constructor(device) {
    this._device = device;
    this._shadowView = new renderer.View();
    this._shadowCamera = new renderer.Camera();
    this._a16_viewProj = new Float32Array(16);
    this._shadowFrameBuffer = null;
    this._shadowTexture = null;
    this._shadowWidth = 1024;
    this._shadowHeight = 1024;
    this._shadowBias = 0.0001;
  }

  setupShadowMap(light) {
    if (!this._shadowFrameBuffer) {
      this._shadowTexture = new gfx.Texture2D(this._device, {
        width: this._shadowWidth,
        height: this._shadowHeight,
        format: gfx.TEXTURE_FMT_RGBA8,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
      });
      this._shadowFrameBuffer = new gfx.FrameBuffer(this._device, this._shadowWidth, this._shadowHeight, {
        colors: [this._shadowTexture]
      });
    }

    this._shadowCamera.setNode(light);
    this._shadowCamera.setStages(['shadowcast']);
    this._shadowCamera.setColor(1, 1, 1, 1);

    let lightType = light.getComp('Light').getType();
    if (lightType === renderer.LIGHT_DIRECTIONAL) {
      this._shadowCamera.setType(renderer.PROJ_ORTHO);
      this._shadowCamera.setNear(0.5);
      this._shadowCamera.setFar(500);
    } else if (lightType === renderer.LIGHT_SPOT) {
      this._shadowCamera.setType(renderer.PROJ_PERSPECTIVE);
      this._shadowCamera.setNear(0.5);
      this._shadowCamera.setFar(500);
      this._shadowCamera.setFov(Math.PI / 2.0);
    } else {
      // TODO: handle other light types.
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

  getShadowView() {
    this._shadowCamera.extractView(this._shadowView, this._shadowWidth, this._shadowHeight);
    return this._shadowView;
  }

  getShadowMap() {
    return this._shadowTexture;
  }

  getViewProjMat() {
    mat4.array(this._a16_viewProj, this._shadowView._matViewProj);
    return this._a16_viewProj;
  }

}
import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color3, toRadian } from 'vmath';

export default class LightComponent extends Component {
  constructor() {
    super();

    this._light = new renderer.Light();
  }

  onInit() {
    let type = renderer.LIGHT_DIRECTIONAL;
    if (this._type === 'point') {
      type = renderer.LIGHT_POINT;
    } else if (this._type === 'spot') {
      type = renderer.LIGHT_SPOT;
    }

    let shadowType = renderer.SHADOW_NONE;
    if (this._shadowType === 'hard') {
      shadowType = renderer.SHADOW_HARD;
    } else if (this._shadowType === 'soft') {
      shadowType = renderer.SHADOW_SOFT;
    }

    this._light.setNode(this._entity);
    this._light.setType(type);
    this._light.setColor(
      this._color.r,
      this._color.g,
      this._color.b
    );
    this._light.setIntensity(this._intensity);
    this._light.setRange(this._range);
    this._light.setSpotAngle(toRadian(this._spotAngle));
    this._light.setSpotExp(this._spotExp);
    this._light.setShadowType(shadowType);
    this._light.setShadowResolution(this._shadowResolution);
    this._light.setShadowDarkness(this._shadowDarkness);
    this._light.setShadowMinDepth(this._shadowMinDepth);
    this._light.setShadowMaxDepth(this._shadowMaxDepth);
    this._light.setShadowDepthScale(this._shadowDepthScale);
  }

  onEnable() {
    this._app.scene.addLight(this._light);
  }

  onDisable() {
    this._app.scene.removeLight(this._light);
  }
}

LightComponent.schema = {
  type: {
    type: 'enums',
    default: 'directional',
    options: ['directional', 'point', 'spot'],
    set(val) {
      if (this._type === val) {
        return;
      }

      this._type = val;

      let type = renderer.LIGHT_DIRECTIONAL;
      if (this._type === 'point') {
        type = renderer.LIGHT_POINT;
      } else if (this._type === 'spot') {
        type = renderer.LIGHT_SPOT;
      }
      this._light.setType(type);
    }
  },

  color: {
    type: 'color3',
    default: [1, 1, 1],
    set(val) {
      if (color3.equals(this._color, val)) {
        return;
      }

      this._color = val;
      this._light.setColor(val.r, val.g, val.b);
    }
  },

  intensity: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._intensity === val) {
        return;
      }

      this._intensity = val;
      this._light.setIntensity(val);
    }
  },

  range: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._range === val) {
        return;
      }

      this._range = val;
      this._light.setRange(val);
    }
  },

  spotAngle: {
    type: 'number',
    default: 60,
    set(val) {
      if (this._spotAngle === val) {
        return;
      }

      this._spotAngle = val;
      this._light.setSpotAngle(toRadian(val));
    }
  },

  spotExp: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._spotExp === val) {
        return;
      }

      this._spotExp = val;
      this._light.setSpotExp(val);
    }
  },

  shadowType: {
    type: 'enums',
    default: 'none',
    options: ['none', 'hard', 'soft'],
    set(val) {
      if (this._shadowType === val) {
        return;
      }

      this._shadowType = val;

      let type = renderer.SHADOW_NONE;
      if (val === 'hard') {
        type = renderer.SHADOW_HARD;
      } else if (val === 'soft') {
        type = renderer.SHADOW_SOFT;
      }
      this._light.setShadowType(type);
    }
  },

  shadowResolution: {
    type: 'number',
    default: 1024,
    set(val) {
      if (this._shadowResolution === val) {
        return;
      }

      this._shadowResolution = val;
      this._light.setShadowResolution(val);
    }
  },

  shadowDarkness: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._shadowDarkness === val) {
        return;
      }

      this._shadowDarkness = val;
      this._light.setShadowDarkness(val);
    }
  },

  shadowMinDepth: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._shadowMinDepth === val) {
        return;
      }

      this._shadowMinDepth = val;
      this._light.setShadowMinDepth(val);
    }
  },

  shadowMaxDepth: {
    type: 'number',
    default: 1000,
    set(val) {
      if (this._shadowMaxDepth === val) {
        return;
      }

      this._shadowMaxDepth = val;
      this._light.setShadowMaxDepth(val);
    }
  },

  shadowDepthScale: {
    type: 'number',
    default: 50,
    set(val) {
      if (this._shadowDepthScale === val) {
        return;
      }

      this._shadowDepthScale = val;
      this._light.setShadowDepthScale(val);
    }
  }
};
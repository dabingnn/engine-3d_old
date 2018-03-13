import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color4, toRadian } from 'vmath';

export default class CameraComponent extends Component {
  onInit() {
    let type = renderer.PROJ_PERSPECTIVE;
    if (this._projection === 'ortho') {
      type = renderer.PROJ_ORTHO;
    }

    this._camera = new renderer.Camera();
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);
    this._camera.setNode(this._entity);
    this._camera.setType(type);
    this._camera.setFov(toRadian(this._fov));
    this._camera.setOrthoHeight(this._orthoHeight);
    this._camera.setNear(this._near);
    this._camera.setFar(this._far);
    this._camera.setColor(
      this._color.r,
      this._color.g,
      this._color.b,
      this._color.a
    );
    this._camera.setDepth(this._depth);
    this._camera.setStencil(this._stencil);
    this._camera.setClearFlags(this._clearFlags);
    this._camera.setRect(
      this._rect.x,
      this._rect.y,
      this._rect.w,
      this._rect.h
    );
  }

  onEnable() {
    this._app.scene.addCamera(this._camera);
  }

  onDisable() {
    this._app.scene.removeCamera(this._camera);
  }
}

CameraComponent.schema = {
  projection: {
    type: 'enums',
    default: 'perspective',
    options: ['ortho', 'perspective'],
    set(val) {
      if (this._projection === val) {
        return;
      }

      this._projection = val;

      let type = renderer.PROJ_PERSPECTIVE;
      if (this._projection === 'ortho') {
        type = renderer.PROJ_ORTHO;
      }
      this._camera.setType(type);
    }
  },

  // fov (in angle)
  fov: {
    type: 'number',
    default: 90,
    set(val) {
      if (this._fov === val) {
        return;
      }

      this._fov = val;
      this._camera.setFov(toRadian(val));
    }
  },

  // orthoHeight
  orthoHeight: {
    type: 'number',
    default: 10,
    set(val) {
      if (this._orthoHeight === val) {
        return;
      }

      this._orthoHeight = val;
      this._camera.setOrthoHeight(val);
    }
  },

  // near
  near: {
    type: 'number',
    default: 0.01,
    set(val) {
      if (this._near === val) {
        return;
      }

      this._near = val;
      this._camera.setNear(val);
    }
  },

  // far
  far: {
    type: 'number',
    default: 1000.0,
    set(val) {
      if (this._far === val) {
        return;
      }

      this._far = val;
      this._camera.setFar(val);
    }
  },

  // color
  color: {
    type: 'color4',
    default: [0.2, 0.3, 0.47, 1],
    set(val) {
      if (color4.equals(val, this._color) ) {
        return;
      }

      this._color = val;
      this._camera.setColor(val.r, val.g, val.b, val.a);
    }
  },

  // depth
  depth: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._depth === val) {
        return;
      }

      this._depth = val;
      this._camera.setDepth(val);
    }
  },

  // stencil
  stencil: {
    type: 'number',
    default: 1,
    set(val) {
      if (this._stencil === val) {
        return;
      }

      this._stencil = val;
      this._camera.setStencil(val);
    }
  },

  // clearFlags
  clearFlags: {
    type: 'number',
    default: 3, // enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
    set(val) {
      if (this._clearFlags === val) {
        return;
      }

      this._clearFlags = val;
      this._camera.setClearFlags(val);
    }
  },

  // rect
  rect: {
    type: 'object',
    default: {
      x: 0, y: 0, w: 1, h: 1,
    },
    set(val) {
      this._rect = val;
      this._camera.setRect(val.x, val.y, val.w, val.h);
    }
  },
};
import { System } from 'ecs.js';

export default class LightSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    comp.entity.on('light-changed', this._onCompChanged);
  }

  remove(comp) {
    comp.entity.off('light-changed', this._onCompChanged);
  }

  _onCompChanged(comp, name, val) {
    if (name === 'enabled') {
      if (val) {
        this._app.scene.addLight(comp._light);
      } else {
        this._app.scene.removeLight(comp._light);
      }
    }
  }
}
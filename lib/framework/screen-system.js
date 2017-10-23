import { System } from 'ecs.js';
import { utils } from 'scene-graph';
import { mat4 } from 'vmath';

export default class ScreenSystem extends System {
  constructor() {
    super();
    this._screens = [];
  }

  add(comp) {
    this._screens.push(comp);
    this._engine.scene.addView(comp._view);
  }

  remove(comp) {
    let idx = this._screens.indexOf(comp);
    if (idx !== -1) {
      this._screens.splice(idx, 1);
      this._engine.scene.removeView(comp._view);
    }
  }

  tick() {
    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];
      let view = screen._view;

      // setup view matrix
      let canvasWidth = this._engine._canvas.width;
      let canvasHeight = this._engine._canvas.height;

      mat4.ortho(view._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
      mat4.copy(view._matViewProj, view._matProj);
      mat4.invert(view._matInvViewProj, view._matProj);
      view._rect.x = view._rect.y = 0;
      view._rect.w = canvasWidth;
      view._rect.h = canvasHeight;

      // sort sprite, update model and setup viewID
      let screenRoot = screen._entity;
      let sortKey = 0;

      utils.walk(screenRoot, entity => {
        let spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          spriteComp._model.updateModelData();
          spriteComp._model.sortKey = sortKey;
          spriteComp._model._viewID = view._id;
        }
        ++sortKey;
        return true;
      });

    }
  }
}
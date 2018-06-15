import Entity from './entity';

export default class Level extends Entity {
  constructor(name) {
    super(name);
  }

  addComp() {
    console.warn('Can not add component in level');
  }

  setParent() {
    console.error('Can not set parent to level');
  }

  activate() {
    if (this._active === true && this._ancestorActive === true) {
      return;
    }
    this._ancestorActive = true;
    super.activate();
  }

  deactivate() {
    if (this._active === false && this._ancestorActive === false) {
      return;
    }
    this._ancestorActive = false;
    super.deactivate();
  }
}
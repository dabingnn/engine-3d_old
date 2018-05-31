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
    this._ancestorActive = true;
    super.activate();
  }

  deactivate() {
    this._ancestorActive = false;
    super.deactivate();
  }
}
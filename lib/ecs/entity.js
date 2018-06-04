import { Node, utils } from '../scene-graph';
import { EventEmitter } from '../event-sys';

// const _setParent = Node.prototype.setParent;
export default class Entity {
  constructor(name) {
    this.__initNode();
    this.__initEventEmitter();

    this.name = name || '';
    this._active = false;
    // NOTE: _ancestorActive not include self
    this._ancestorActive = false;
    this._destroyed = false;
    this._comps = [];
    this._tweens = null;

    // app internal data
    this._app = null;
    this._poolID = -1;
  }

  get tweens() {
    return this._tweens;
  }

  /**
   * @property {boolean} active
   */
  get active() {
    return this._active;
  }
  set active(val) {
    val = !!val;
    if (this._active !== val) {
      if (val) {
        this.activate();
      } else {
        this.deactivate();
      }
    }

  }

  get activeInHierarchy() {
    return this._active && this._ancestorActive;
  }

  get destroyed() {
    return this._destroyed;
  }

  addTween(component, prop, option) {
    if (!this._tweens) {
      this._tweens = this._app._vtween.newTimeLine({});
    }

    if (component === 'Entity') {
      let vtween = this._app._vtween.newTask(this, prop, option);
      this._tweens.add(vtween);
      return;
    }

    let com = this.getComp(component);

    if (!com) {
      return;
    }

    let vtween = this._app._vtween.newTask(com, prop, option);
    this._tweens.add(vtween);
  }

  activate() {
    if (this._active === true) {
      return;
    }
    this._active = true;
    if (this._ancestorActive) {
      this._notifyChildren(true);
      this._notifyComponents(true);
    }
  }

  deactivate() {
    if (this._active === false) {
      return;
    }
    this._active = false;
    if (this._ancestorActive) {
      this._notifyChildren(false);
      this._notifyComponents(false);
    }
  }

  _notifyComponents(active) {

    this.emit(active ? 'active' : 'inactive');

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      comp._onEntityActiveChanged(active);
    }
  }

  _notifyChildren(active) {
    for (let i = 0; i < this._children.length; ++i) {
      let child = this._children[i];
      child._ancestorActive = active;
      // do not need to set if child is inactive
      if (child.active) {
        child._notifyChildren(active);
        child._notifyComponents(active);
      }

    }
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    // mark as destroyed
    this._destroyed = true;

    // recursively destroy child entities
    for (let i = 0; i < this._children.length; ++i) {
      let child = this._children[i];
      child.destroy();
    }

    // remove all components
    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      comp.destroy();
    }
    // emit disable
    if (this.activeInHierarchy) {
      this.emit('inactive');
    }
    // submit destroy request
    this._app._destroyEntity(this);
  }

  _onParentChanged(oldParent, newParent) {
    let oldAncestorState = !!(oldParent && oldParent.activeInHierarchy);
    this._ancestorActive = !!(newParent && newParent.activeInHierarchy);
    if (this._active && this._ancestorActive !== oldAncestorState) {
      this._notifyChildren(this._ancestorActive);
      this._notifyComponents(this._ancestorActive);
    }
    this.emit('parent-changed', oldParent, newParent);
  }

  clone() {
    return this._app.cloneEntity(this);
  }

  deepClone() {
    return this._app.deepCloneEntity(this);
  }

  getComp(classname) {
    const ctor = this._app.getClass(classname);

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        return comp;
      }
    }

    return null;
  }

  getComps(classname) {
    const ctor = this._app.getClass(classname);
    let results = [];

    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps[i];
      if (comp instanceof ctor) {
        results.push(comp);
      }
    }

    return results;
  }

  getCompsInChildren(classname) {
    const ctor = this._app.getClass(classname);
    let results = [];

    utils.walk(this, function (n) {
      for (let i = 0; i < n._comps.length; ++i) {
        let comp = n._comps[i];
        if (comp instanceof ctor) {
          results.push(comp);
        }
      }
    });

    return results;
  }

  addComp(classname, data) {
    const ctor = this._app.getClass(classname);

    if (!ctor.multiple) {
      if (this.getComp(classname)) {
        return null;
      }
    }

    let comp = this._app._createComp(ctor, this, data);
    this._comps.push(comp);
    if (this.activeInHierarchy) {
      comp._onEntityActiveChanged(true);
    }
    return comp;
  }

  // call by app
  _removeComp(comp) {
    for (let i = 0; i < this._comps.length; ++i) {
      let c = this._comps[i];
      if (c === comp) {
        this._comps.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}

Node.mixin(Entity);
EventEmitter.mixin(Entity);
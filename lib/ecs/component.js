import ComponentEvent from './event';

export default class Component {
  constructor() {
    this._enabled = true;
    this._destroyed = false;
    this._inited = false;

    // app internal data
    this._app = null;
    this._system = null;
    this._entity = null;
  }

  get enabled() {
    return this._entity.activeInHierarchy && this._enabled;
  }
  set enabled(val) {
    if (this._enabled !== val) {
      this._enabled = val;

      if (this._entity.activeInHierarchy) {
        if (this._enabled) {
          this.onEnable && this.onEnable();
        } else {
          this.onDisable && this.onDisable();
        }
      }
    }
  }

  _onEntityActiveChanged(active) {
    // todo add implementation
    if (!this._inited) {
      this._inited = true;
      if (this.onInit) {
        this.onInit();
      }
    }
    if (this._enabled) {
      if (active) {
        this.onEnable && this.onEnable();
      } else {
        this.onDisable && this.onDisable();
      }
    }
  }

  _onComponentNeedDestroy() {
    if(this._inited) {
      this.onDestroy && this.onDestroy();
      this._inited = false;
    }
  }

  get destroyed() {
    return this._entity.destroyed || this._destroyed;
  }

  get system() {
    return this._system;
  }

  get entity() {
    return this._entity;
  }

  dispatch(evt, opts) {
    let event = evt;
    if (typeof evt === 'string') {
      event = new ComponentEvent(evt, opts);
    }

    event.target = this._entity;
    event.component = this;
    this._entity.dispatch(event);
  }

  destroy() {
    if (this._destroyed) {
      return;
    }

    // mark as destroyed
    this._destroyed = true;
    // call entityInactive
    let ent = this._entity;

    if (this.enabled) {
      this.onDisable && this.onDisable();
    }

    // submit destroy request
    this._app._destroyComp(this);
  }
}

/**
 * callbacks:
 *
 *  - onInit()
 *  - onDestroy()
 *  - onEnable()
 *  - onDisable()
 *  - onClone(src)
 *
 * static members:
 *
 *  - events: {
 *    'foo': 'onFoo',
 *    'bar': 'onBar'
 *  }
 *
 *  - schema: {
 *    'foo': { default: 'hello', type: 'string', array: false }
 *  }
 */

import Event from './event';

// forked from: https://github.com/primus/eventemitter3

const has = Object.prototype.hasOwnProperty;

/**
 * An event-table is a plain object whose properties are event names.
 */
function _createTable() {
  let obj = Object.create(null);
  obj.__tmp__ = undefined;
  delete obj.__tmp__;

  return obj;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function _EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function _addListener(emitter, evt, fn, context, once) {
  let listener = new _EE(fn, context || emitter, once);

  if (!emitter._events[evt]) {
    emitter._events[evt] = listener;
    emitter._eventsCount++;
  } else if (!emitter._events[evt].fn) {
    emitter._events[evt].push(listener);
  } else {
    emitter._events[evt] = [emitter._events[evt], listener];
  }

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function _clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) {
    emitter._events = _createTable();
  } else {
    delete emitter._events[evt];
  }
}

/**
 * bubble event
 *
 * @param {Event} event
 * @private
 */
function _dispatchEvent(event) {
  let emitter = event.target;

  while (emitter) {
    emitter.emit(event.name, event);

    if (!event.bubbles || event._stopped) {
      break;
    }

    emitter = emitter.parent;
  }
}

/**
 * @class EventEmitter
 */
export default class EventEmitter {
  static mixin (cls) {
    Object.getOwnPropertyNames(EventEmitter.prototype).forEach(function (name) {
      if (cls.prototype.hasOwnProperty(name) === false) {
        Object.defineProperty(
          cls.prototype,
          name,
          Object.getOwnPropertyDescriptor(EventEmitter.prototype, name)
        );
      }
    });
    cls.prototype.__initEventEmitter = function () {
      this._events = _createTable();
      this._eventsCount = 0;
    };
  }

  constructor() {
    this._events = _createTable();
    this._eventsCount = 0;
  }

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   *
   * @returns {Array}
   */
  eventNames() {
    let names = [], events, name;

    if (this._eventsCount === 0) {
      return names;
    }

    for (name in (events = this._events)) {
      if (has.call(events, name)) {
        names.push(name);
      }
    }

    if (Object.getOwnPropertySymbols) {
      return names.concat(Object.getOwnPropertySymbols(events));
    }

    return names;
  }

  /**
   * Return the listeners registered for a given event.
   *
   * @param {(String|Symbol)} evt The event name.
   * @param {Boolean} exists Only check if there are listeners.
   * @returns {(Array|Boolean)}
   */
  listeners(evt, exists) {
    let available = this._events[evt];

    if (exists) {
      return !!available;
    }

    if (!available) {
      return [];
    }

    if (available.fn) {
      return [available.fn];
    }

    let l = available.length;
    let ee = new Array(l);

    for (let i = 0; i < l; ++i) {
      ee[i] = available[i].fn;
    }

    return ee;
  }

  /**
   * Calls each of the listeners registered for a given event.
   *
   * @param {(String|Symbol)} evt The event name.
   * @param {*} a1
   * @param {*} a2
   * @param {*} a3
   * @param {*} a4
   * @param {*} a5
   * @returns {Boolean} `true` if the event had listeners, else `false`.
   */
  emit(evt, a1, a2, a3, a4, a5) {
    if (!this._events[evt]) {
      return false;
    }

    let listeners = this._events[evt]
      , len = arguments.length
      , args
      , i;

    if (listeners.fn) {
      if (listeners.once) {
        this.off(evt, listeners.fn, undefined, true);
      }

      switch (len) {
        case 1: return listeners.fn.call(listeners.context), true;
        case 2: return listeners.fn.call(listeners.context, a1), true;
        case 3: return listeners.fn.call(listeners.context, a1, a2), true;
        case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
        case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
        case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
      }

      for (i = 1, args = new Array(len - 1); i < len; i++) {
        args[i - 1] = arguments[i];
      }

      listeners.fn.apply(listeners.context, args);
    } else {
      let length = listeners.length, j;

      for (i = 0; i < length; i++) {
        if (listeners[i].once) {
          this.off(evt, listeners[i].fn, undefined, true);
        }

        switch (len) {
          case 1: listeners[i].fn.call(listeners[i].context); break;
          case 2: listeners[i].fn.call(listeners[i].context, a1); break;
          case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
          case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
          default:
            if (!args) {
              for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
            }

            listeners[i].fn.apply(listeners[i].context, args);
        }
      }
    }

    return true;
  }

  /**
   * Add a listener for a given event.
   *
   * @param {(String|Symbol)} evt The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */
  on(evt, fn, context) {
    return _addListener(this, evt, fn, context, false);
  }

  /**
   * Add a one-time listener for a given event.
   *
   * @param {(String|Symbol)} evt The event name.
   * @param {Function} fn The listener function.
   * @param {*} [context=this] The context to invoke the listener with.
   * @returns {EventEmitter} `this`.
   * @public
   */
  once(evt, fn, context) {
    return _addListener(this, evt, fn, context, true);
  }

  /**
   * Remove the listeners of a given event.
   *
   * @param {(String|Symbol)} evt The event name.
   * @param {Function} fn Only remove the listeners that match this function.
   * @param {*} context Only remove the listeners that have this context.
   * @param {Boolean} once Only remove one-time listeners.
   * @returns {EventEmitter} `this`.
   * @public
   */
  off(evt, fn, context, once) {
    if (!this._events[evt]) {
      return this;
    }

    if (!fn) {
      _clearEvent(this, evt);
      return this;
    }

    let listeners = this._events[evt];

    if (listeners.fn) {
      if (
        listeners.fn === fn &&
        (!once || listeners.once) &&
        (!context || listeners.context === context)
      ) {
        _clearEvent(this, evt);
      }
    } else {
      let events = [];
      for (let i = 0, l = listeners.length; i < l; i++) {
        if (
          listeners[i].fn !== fn ||
          (once && !listeners[i].once) ||
          (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }

      //
      // Reset the array, or remove it completely if we have no more listeners.
      //
      if (events.length) {
        this._events[evt] = events.length === 1 ? events[0] : events;
      } else {
        _clearEvent(this, evt);
      }
    }

    return this;
  }

  /**
   * Remove all listeners, or those of the specified event.
   *
   * @param {(String|Symbol)} [evt] The event name.
   * @returns {EventEmitter} `this`.
   * @public
   */
  removeAllListeners(evt) {
    if (evt) {
      if (this._events[evt]) {
        _clearEvent(this, evt);
      }
    } else {
      this._events = _createTable();
      this._eventsCount = 0;
    }

    return this;
  }

  /**
   * @param {Event|string} evt
   * @param {object} [opts]
   */
  dispatch(evt, opts) {
    let event = evt;
    if (typeof evt === 'string') {
      event = new Event(evt, opts);
    }

    event.target = this;
    _dispatchEvent(event);
  }
}

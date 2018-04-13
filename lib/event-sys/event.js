/**
 * @class Event
 */
export default class Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name, opts = {}) {
    this.name = name;
    this.detail = opts.detail;
    this.bubbles = !!opts.bubbles;

    // NOTE: DO NOT set target from opts,
    // the target must be set manually from the user who create the event.
    this.target = null;
    this._stopped = false;
  }

  /**
   * @method stop
   *
   * Stop propgation
   */
  stop() {
    this._stopped = true;
  }
}
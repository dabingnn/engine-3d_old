import { Event } from 'event-sys';

export default class FocusEvent extends Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name, opts) {
    super(name, opts);
    this.reset();
  }

  /**
   * @method reset
   *
   * reset mouse value
   */
  reset() {
    this._stopped = false;
    this.target = null;
    this.bubbles = false;

    this.relatedTarget = null;
  }
}
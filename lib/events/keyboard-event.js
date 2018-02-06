import { Event } from 'event-sys';

export default class KeyboardEvent extends Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name) {
    super(name);
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
    this.sender = null;
    this.bubbles = false;

    this.key = '';
  }
}
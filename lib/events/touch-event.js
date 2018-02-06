import { Event } from 'event-sys';

export default class TouchEvent extends Event {
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

    this.dx = 0.0;
    this.dy = 0.0;
    this.x = 0.0;
    this.y = 0.0;
  }
}
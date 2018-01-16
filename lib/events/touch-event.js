import { Event } from 'event-sys';

export default class TouchEvent extends Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name) {
    super(name, {
      bubbles: true
    });
    this.reset();
  }

  /**
   * @method reset
   *
   * reset mouse value
   */
  reset() {
    this.target = null;
    this.sender = null;

    this.dx = 0.0;
    this.dy = 0.0;
    this.x = 0.0;
    this.y = 0.0;
  }
}
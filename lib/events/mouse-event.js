import { Event } from 'event-sys';

export default class MouseEvent extends Event {
  /**
   * @param {string} name
   * @param {object} opts
   * @param {object} [opts.detail]
   * @param {boolean} [opts.bubbles]
   */
  constructor(name) {
    super(name, {
      bubbles: false
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
    this.mouseX = 0.0;
    this.mouseY = 0.0;
    this.button = 0;
    this.buttons = 0;
  }
}
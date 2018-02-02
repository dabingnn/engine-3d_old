import { Event } from 'event-sys';

export default class FocusEvent extends Event {
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

    this.relatedTarget = null;
  }
}
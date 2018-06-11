import FixedArray from '../memop/fixed-array';
import Timeline from './timeline';
import easing from './easing';
import utils from './utils';

//core
export default class VTween {
  constructor(app) {
    this._activeTimelines = new FixedArray(10);
    this._app = app;
  }

  newTracks(targets, props, opts = {}) {
    if (opts.duration === undefined) {
      opts.duration = 1;
    }
    if (opts.delay === undefined) {
      opts.delay = 0;
    }
    if (opts.easing === undefined) {
      opts.easing = easing.linearNone;
    }
    // if (opts.elasticity === undefined) {
    //   opts.elasticity = 500;
    // }

    return utils.createTracks(targets, props, opts);
  }

  newTimeLine(opts = {}) {
    let timeLine =  new Timeline(this, opts);

    return timeLine;
  }

  _add(tl) {
    this._activeTimelines.push(tl);
  }

  _remove(tl) {
    for (let i = 0; i < this._activeTimelines.length; ++i) {
      let _tl = this._activeTimelines.data[i];
      if (_tl === tl) {
        this._activeTimelines.fastRemove(i);
        break;
      }
    }
  }

  tick(t) {
    for (let i = 0; i < this._activeTimelines.length; ++i) {
      let tl = this._activeTimelines.data[i];
      tl.tick(t);
    }
  }
}
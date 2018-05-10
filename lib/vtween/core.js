import FixedArray from '../memop/fixed-array';
import Task from './task';
import { easing } from './easing';

//core
export default class VTween {
  constructor() {
    this._activeTasks = new FixedArray(10);
  }

  newTask(targets, props, opts) {
    if (opts.duration === undefined) {
      opts.duration = 1000;
    }
    if (opts.delay === undefined) {
      opts.delay = 0;
    }
    if (opts.easing === undefined) {
      opts.easing = easing.linear.none;
    }
    if (opts.elasticity === undefined) {
      opts.elasticity = 500;
    }

    if (Array.isArray(targets) === false) {
      targets = [targets];
    }

    return new Task(this, targets, props, opts);
  }

  newTimeLine(opts) {
    opts.autoplay = false;
    let timeLine = new Task(this, {}, {}, opts);
    timeLine.pause();

    timeLine.add = function (task) {
      if (timeLine.duration <= task.duration) {
        timeLine.duration = task.duration;
      }
      timeLine.pause();
      task.pause();
      task.began = true;
      task.completed = true;
      task.direction = timeLine.direction;
      task.loops = timeLine.loop;

      timeLine.children.push(task);
    };

    return timeLine;
  }

  _add(task) {
    this._activeTasks.push(task);
  }

  _remove(task) {
    for (let i = 0; i < this._activeTasks.length; ++i) {
      let t = this._activeTasks.data[i];
      if (t === task) {
        this._activeTasks.fastRemove(i);
        break;
      }
    }
  }

  tick(dt) {
    for (let i = 0; i < this._activeTasks.length; ++i) {
      let t = this._activeTasks.data[i];
      t.tick(dt);
    }
  }
}
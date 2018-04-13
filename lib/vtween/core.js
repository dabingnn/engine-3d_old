import LinkedArray from './linked-array';
import Task from './task';
import { easing } from './easing';

//core
export default class VTween {
  constructor() {
    this._activeTasks = new LinkedArray();
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
    }

    return timeLine;
  }

  _add(task) {
    this._activeTasks.add(task);
  }

  _remove(task) {
    this._activeTasks.remove(task);
  }

  tick(dt) {
    let cursor = this._activeTasks.head;
    let next = cursor;

    while (cursor) {
      next = cursor._next;
      cursor.tick(dt);
      cursor = next;
    }
  }
}
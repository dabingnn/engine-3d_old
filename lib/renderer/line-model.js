import { vec3, color3 } from 'vmath';
import { LinkedArray } from 'memop';
import renderer from 'renderer.js';

export default class LineModel extends renderer.Model {
  constructor() {
    super();

    this._dynamicIA = true;
    this.lines = new LinkedArray(() => {
      return {
        start: vec3.create(),
        end: vec3.create(),
        color: color3.create(),
        timer: 0.0,
        duration: 0.0,

        _prev: null,
        _next: null,
      };
    }, 2000);
  }

  addLine(start, end, color, duration = 0.0) {
    let line = this.lines.add();

    vec3.copy(line.start, start);
    vec3.copy(line.end, end);
    color3.copy(line.color, color);
    line.timer = 0.0;
    line.duration = duration;

    return line;
  }

  tick(dt) {
    this.lines.forEach(item => {
      if (item.timer > item.duration) {
        this.lines.remove(item);
        return;
      }

      item.timer += dt;
    });
  }
}

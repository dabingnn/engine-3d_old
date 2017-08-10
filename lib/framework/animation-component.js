import { Component } from 'ecs.js';

export default class AnimationComponent extends Component {
  constructor() {
    super();

    this._clips = [];
    this._skeleton = null;

    // internal states
    this._activeClip = null;
    this._time = 0;
  }

  set skeleton(val) {
    if (this._skeleton !== val) {
      this._skeleton = val;
    }
  }

  addClip(animClip) {
    this._clips.push(animClip);
  }

  play(name) {
    let found;
    this._time = 0;

    for (let i = 0; i < this._clips.length; ++i) {
      let clip = this._clips[i];
      if (clip.name === name) {
        found = clip;
      }
    }

    if (found) {
      this._activeClip = found;
    }
  }
}
import { Component } from 'ecs.js';

export default class ScriptComponent extends Component {
  constructor() {
    super();

    this._startedFlag = 0;
  }

  onInit() {
    this._system.add(this);
  }

  onDestroy() {
    this._system.remove(this);
  }

  awake() {
  }

  start() {
  }

  update() {
  }

  postUpdate() {
  }

  end() {
  }
}
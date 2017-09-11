import { Component } from 'ecs.js';
import renderer from 'renderer.js';

export default class CameraComponent extends Component {
  constructor() {
    super();

    this._camera = new renderer.Camera();
  }

  onInit() {
    this._camera.setNode(this._entity);
  }

  // TODO: other properties
}
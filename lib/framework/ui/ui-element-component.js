import { Component } from '../../ecs';

export default class UIElementComponent extends Component {

  onInit() {
    this._system.add(this);
  }

  onDestroy() {
    this._system.remove(this);
  }
}

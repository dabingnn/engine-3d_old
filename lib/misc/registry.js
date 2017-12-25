let _loaderInfos = [];
let _componentInfos = [];
let _systemInfos = [];

export default {
  registerLoader(id, loader) {
    _loaderInfos.push({
      id, loader
    });
  },

  registerComponent(id, component) {
    _componentInfos.push({
      id, component
    });
  },

  registerSystem(id, system, component, priority) {
    _systemInfos.push({
      id, system, component, priority
    });
  },

  _init (app) {
    for (let i = 0; i < _loaderInfos.length; ++i) {
      let info = _loaderInfos[i];
      app._assetMng.registerLoader(info.id, info.loader);
    }

    for (let i = 0; i < _componentInfos.length; ++i) {
      let info = _componentInfos[i];
      app.registerClass(info.id, info.component);
    }

    for (let i = 0; i < _systemInfos.length; ++i) {
      let info = _systemInfos[i];
      app.registerSystem(info.id, info.system, info.component, info.priority);
    }
  }
};
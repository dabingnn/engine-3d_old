import main from '../../index';

let _name2extinfo = {};

export default {
  add(name, info) {
    _name2extinfo[name] = info;
    Object.assign(main, info.modules);
  },

  _init(app) {
    for (let name in _name2extinfo) {
      let info = _name2extinfo[name];
      info.init(app);
    }
  }
};
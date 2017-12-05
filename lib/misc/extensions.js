import main from '../../index';

let _name2extinfo = {};

export default {
  add(name, info) {
    if (main[name] !== undefined) {
      console.warn(`Failed to register module ${name}, already exists.`);
      return;
    }

    _name2extinfo[name] = info;
    main[name] = {};

    Object.assign(main[name], info.modules);
  },

  _init(app) {
    for (let name in _name2extinfo) {
      let info = _name2extinfo[name];
      info.init(app);
    }
  }
};
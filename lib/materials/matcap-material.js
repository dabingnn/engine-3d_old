import renderer from 'renderer.js';
import Material from '../assets/material';
import { color4 } from 'vmath';

export default class MatcapMaterial extends Material {
  constructor() {
    super();
    let pass = new renderer.Pass('matcap');
    pass.setDepth(true,true);

    let mainTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'mainTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'matcapTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'colorFactor', type: renderer.PARAM_FLOAT },
        { name: 'color', type: renderer.PARAM_COLOR4 },
      ],
      [pass]
    );

    this._effect = new renderer.Effect(
      [mainTech],
      {},
      [
        { name: 'useMainTex', value: true },
        { name: 'useSkinning', value: true},
      ]
    );
    this._mainTex = null;
    this._matcapTex = null;
    this._colorFactor = 0.5;
    this._color = color4.new(1.0, 1.0, 1.0, 1.0);
  }

  get mainTex() {
    return this._mainTex;
  }

  get matcapTex() {
    return this._matcapTex;
  }

  get colorFactor() {
    return this._colorFactor;
  }

  set mainTex(val) {
    if (this._mainTex === val) {
      return;
    }
    this._mainTex = val;
    this._effect.setValue('mainTex', val._texture);
  }

  set matcapTex(val) {
    if (this._matcapTex === val) {
      return;
    }
    this._matcapTex = val;
    this._effect.setValue('matcapTex', val._texture);
  }

  set colorFactor(val) {
    if (this._colorFactor === val) {
      return;
    }
    this._colorFactor = val;
    this._effect.setValue('colorFactor', val);
  }

  set color(val) {
    if (this._color === val) {
      return;
    }
    this._color = val;
    this._effect.setValue('color',val);
  }

  set useMainTex(val) {
    this._effect.setOption('useMainTex', val);
  }

  set useSkinning(val) {
    this._effect.setOption('useSkinning', val);
  }

}
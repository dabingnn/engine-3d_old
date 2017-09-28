import gfx from 'gfx.js';
import renderer from 'renderer.js';
import Material from '../assets/material';
import { color4 } from 'vmath';

const { Pass, Technique } = renderer;

export default class MatcapMaterial extends Material {
  constructor() {
    super();
    let pass = new renderer.Pass('matcap');
    pass.setDepth(true,true);

    let mainTech = new renderer.Technique(
      renderer.STAGE_OPAQUE,
      [
        { name: 'mainTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'matcapTex', type: renderer.PARAM_TEXTURE_2D },
        { name: 'mixRate', type: renderer.PARAM_FLOAT },
        { name: 'mainColor', type: renderer.PARAM_COLOR4 },
      ],
      [
        pass
      ]
    );

    this._effect = new renderer.Effect(
        [mainTech],
        {},
        [
          { name: 'useMainTex', value: true },
          { name: 'useMainColor', value: false},
          { name: 'useSkinning', value: true},
        ]
    );
    this._mainTex = null;
    this._matcapTex = null;
    this._mixRate = 0.5;
    this._mainColor = color4.new(1.0, 1.0, 1.0, 1.0);
  }

  get mainTex() {
      return this._mainTex;
  }

  get matcapTex() {
      return this._matcapTex;
  }

  get mixRate() {
      return this._mixRate;
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

  set mixRate(val) {
      if (this._mixRate === val) {
          return;
      }
      this._mixRate = val;
      this._effect.setValue('mixRate', val);
  }

  set mainColor(val) {
      if (this._mainColor === val) {
          return;
      }
      this._mainColor = val;
      this._effect.setValue('mainColor',val);
  }

  set useMainTex(val) {
      this._effect.setOption('useMainTex', val);
  }

  set useMainColor(val) {
      this._effect.setOption('useMainColor', val);
  }

  set useSkinning(val) {
      this._effect.setOption('useSkinning', val);
  }

}
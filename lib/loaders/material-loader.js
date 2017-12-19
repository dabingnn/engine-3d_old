import { vec2, color4 } from 'vmath';
import Material from '../assets/material';
import resl from '../misc/resl';
import async from '../misc/async';

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
    },

    onDone(data) {
      const { json } = data;

      let material = new Material();
      const props = json.properties;

      if (json.type === 'unlit') {
        material.effectAsset = app.assets.get('builtin-unlit');

        // values
        if (props.color) {
          material.setProperty('color', color4.new(
              props.color[0],
              props.color[1],
              props.color[2],
              props.color[3]
            )
          );
        }

        if (props.mainTextureTiling) {
          material.setProperty('mainTiling', vec2.new(
              props.mainTextureTiling[0],
              props.mainTextureTiling[1]
            )
          );
        }

        if (props.mainTextureOffset) {
          material.setProperty('mainOffset', vec2.new(
              props.mainTextureOffset[0],
              props.mainTextureOffset[1]
            )
          );
        }

        let tasks = [];

        // assets
        if (props.mainTexture) {
          tasks.push(done => {
            app.assets.load(props.mainTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty("mainTexture", asset._texture);
              material.define('USE_TEXTURE', true);
              done();
            });
          });
        }
        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });

      } else if (json.type === 'phong') {
        material.effectAsset = app.assets.get('builtin-phong');

        // values
        if (props.diffuseColor) {
          material.setProperty('diffuseColor', color4.new(
              props.diffuseColor[0],
              props.diffuseColor[1],
              props.diffuseColor[2],
              props.diffuseColor[3]
            )
          );
        }

        if (props.diffuseTiling) {
          material.setProperty('diffuseTiling', vec2.new(
              props.diffuseTiling[0],
              props.diffuseTiling[1]
            )
          );
        }

        if (props.diffuseOffset) {
          material.setProperty('diffuseOffset', vec2.new(
              props.diffuseOffset[0],
              props.diffuseOffset[1]
            )
          );
        }

        let tasks = [];

        // assets
        if (props.diffuse) {
          tasks.push(done => {
            app.assets.load(props.diffuse, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('diffuseTexture', asset._texture);
              material.define('USE_DIFFUSE_TEXTURE', true);
              done();
            });
          });
        }
        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'grid') {
        material.effectAsset = app.assets.get('builtin-grid');

        material.define('USE_WORLD_POS', props.useWorldPos);
        material.setProperty('tiling', vec2.new(props.tilingX, props.tilingY));
        material.setProperty('baseColorBlack', color4.new(
            props.baseColorBlack[0],
            props.baseColorBlack[1],
            props.baseColorBlack[2],
            props.baseColorBlack[3]
          )
        );
        material.setProperty('baseColorWhite', color4.new(
            props.baseColorWhite[0],
            props.baseColorWhite[1],
            props.baseColorWhite[2],
            props.baseColorWhite[3]
          )
        );
        material.setProperty('subPatternColor', color4.new(
            props.subPatternColor[0],
            props.subPatternColor[1],
            props.subPatternColor[2],
            props.subPatternColor[3]
          )
        );
        material.setProperty('subPatternColor2', color4.new(
            props.subPatternColor2[0],
            props.subPatternColor2[1],
            props.subPatternColor2[2],
            props.subPatternColor2[3]
          )
        );

        material.setProperty('basePatternTiling', vec2.new(
            props.basePatternTiling[0],
            props.basePatternTiling[1]
          )
        );
        material.setProperty('basePatternOffset', vec2.new(
            props.basePatternOffset[0],
            props.basePatternOffset[1]
          )
        );

        material.setProperty('subPatternTiling', vec2.new(
            props.subPatternTiling[0],
            props.subPatternTiling[1]
          )
        );
        material.setProperty('subPatternOffset', vec2.new(
            props.subPatternOffset[0],
            props.subPatternOffset[1]
          )
        );

        material.setProperty('subPattern2Tiling', vec2.new(
            props.subPattern2Tiling[0],
            props.subPattern2Tiling[1]
          )
        );
        material.setProperty('subPattern2Offset', vec2.new(
            props.subPattern2Offset[0],
            props.subPattern2Offset[1]
          )
        );

        // HACK: we should have a way to set default texture
        app.assets.load('black-texture', (err, asset) => {
          material.setProperty('basePattern', asset._texture);
          material.setProperty('subPattern', asset._texture);
          material.setProperty('subPattern2', asset._texture);
        });

        // textures
        let tasks = [];
        if (props.basePattern) {
          tasks.push(done => {
            app.assets.load(props.basePattern, (err, asset) => {
              material.setProperty('basePattern', asset._texture);
              done();
            });
          });
        }
        if (props.subPattern) {
          tasks.push(done => {
            app.assets.load(props.subPattern, (err, asset) => {
              material.setProperty('subPattern', asset._texture);
              done();
            });
          });
        }
        if (props.subPattern2) {
          tasks.push(done => {
            app.assets.load(props.subPattern2, (err, asset) => {
              material.setProperty('subPattern2', asset._texture);
              done();
            });
          });
        }

        //
        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'matcap') {
        material.effectAsset = app.assets.get('builtin-matcap');

        // values
        if (props.colorFactor) {
          material.setProperty('colorFactor', props.colorFactor);
        }
        if (props.color) {
          material.setProperty('color', color4.new(
              props.color[0],
              props.color[1],
              props.color[2],
              props.color[3]
            )
          );
        }

        // textures
        let tasks = [];

        if (props.mainTex) {
          tasks.push(done => {
            app.assets.load(props.mainTex, (err, asset) => {
              material.setProperty('mainTex', asset._texture);
              material.define('USE_MAIN_TEX', true);
              done();
            });
          });
        }
        if (props.matcapTex) {
          tasks.push(done => {
            app.assets.load(props.matcapTex, (err, asset) => {
              material.setProperty('matcapTex', asset._texture);
              done();
            });
          });
        }
        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else if (json.type === 'pbr') {
        material.effectAsset = app.assets.get('builtin-pbr');

        // textures
        let tasks = [];

        if (props.albedoTexture) {
          tasks.push(done => {
            app.assets.load(props.albedoTexture, (err, asset) => {
              material.setProperty('albedoTexture', asset._texture);
              material.define('USE_ALBEDO_TEXTURE', true);
              done();
            });
          });
        }
        if (props.metallicTexture) {
          tasks.push(done => {
            app.assets.load(props.metallicTexture, (err, asset) => {
              material.setProperty('metallicTexture', asset._texture);
              material.define('USE_METALLIC_TEXTURE', true);
              done();
            });
          });
        }
        if (props.roughnessTexture) {
          tasks.push(done => {
            app.assets.load(props.roughnessTexture, (err, asset) => {
              material.setProperty('roughnessTexture', asset._texture);
              material.define('USE_ROUGHNESS_TEXTURE', true);
              done();
            });
          });
        }
        if (props.normalTexture) {
          tasks.push(done => {
            app.assets.load(props.normalTexture, (err, asset) => {
              material.setProperty('normalTexture', asset._texture);
              material.define('USE_NORMAL_TEXTURE', true);
              done();
            });
          });
        }
        if (props.aoTexture) {
          tasks.push(done => {
            app.assets.load(props.aoTexture, (err, asset) => {
              material.setProperty('aoTexture', asset._texture);
              material.define('USE_AO_TEXTURE', true);
              done();
            });
          });
        }
        // TODO: add emission texture?
        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          callback(null, material);
        });
      } else { // TODO: support other materials that maybe loaded from assets.
        console.error('unsupported material loading');
      }
    }
  });
}
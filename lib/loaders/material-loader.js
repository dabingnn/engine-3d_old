import { vec2, color3, color4 } from '../vmath';
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
        material.effect = app.assets.get('builtin-effect-unlit');

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

        if (props.mainTiling) {
          material.setProperty('mainTiling', vec2.new(
              props.mainTiling[0],
              props.mainTiling[1]
            )
          );
        }

        if (props.mainOffset) {
          material.setProperty('mainOffset', vec2.new(
              props.mainOffset[0],
              props.mainOffset[1]
            )
          );
        }

        let tasks = [];

        // assets
        if (props.mainTexture) {
          tasks.push(done => {
            app.assets.load(props.mainTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('mainTexture', asset);
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
        material.effect = app.assets.get('builtin-effect-phong');

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

        if (props.mainTiling) {
          material.setProperty('mainTiling', vec2.new(
              props.mainTiling[0],
              props.mainTiling[1]
            )
          );
        }

        if (props.mainOffset) {
          material.setProperty('mainOffset', vec2.new(
              props.mainOffset[0],
              props.mainOffset[1]
            )
          );
        }

        material.define('USE_SPECULAR', props.USE_SPECULAR);
        if (props.specularColor) {
          material.setProperty('specularColor', color4.new(
              props.specularColor[0],
              props.specularColor[1],
              props.specularColor[2],
              props.specularColor[3]
            )
          );
        }

        material.define('USE_EMISSIVE', props.USE_EMISSIVE);
        if (props.emissiveColor) {
          material.setProperty('emissiveColor', color3.new(
              props.emissiveColor[0],
              props.emissiveColor[1],
              props.emissiveColor[2]
            )
          );
        }

        if (props.glossiness) {
          material.setProperty('glossiness', props.glossiness);
        }

        let tasks = [];

        // assets
        material.define('USE_DIFFUSE_TEXTURE', props.USE_DIFFUSE_TEXTURE);
        if (props.diffuse_texture) {
          tasks.push(done => {
            app.assets.load(props.diffuse_texture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('diffuse_texture', asset);
              done();
            });
          });
        }

        material.define('USE_SPECULAR_TEXTURE', props.USE_SPECULAR_TEXTURE);
        if (props.specular_texture) {
          tasks.push(done => {
            app.assets.load(props.specular_texture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('specular_texture', asset);
              done();
            });
          });
        }

        material.define('USE_EMISSIVE_TEXTURE', props.USE_EMISSIVE_TEXTURE);
        if (props.emissive_texture) {
          tasks.push(done => {
            app.assets.load(props.emissive_texture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('emissive_texture', asset);
              done();
            });
          });
        }

        material.define('USE_NORMAL_TEXTURE', props.USE_NORMAL_TEXTURE);
        if (props.normal_texture) {
          tasks.push(done => {
            app.assets.load(props.normal_texture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('normal_texture', asset);
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
        material.effect = app.assets.get('builtin-effect-grid');

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
          material.setProperty('basePattern', asset);
          material.setProperty('subPattern', asset);
          material.setProperty('subPattern2', asset);
        });

        // textures
        let tasks = [];
        if (props.basePattern) {
          tasks.push(done => {
            app.assets.load(props.basePattern, (err, asset) => {
              material.setProperty('basePattern', asset);
              done();
            });
          });
        }
        if (props.subPattern) {
          tasks.push(done => {
            app.assets.load(props.subPattern, (err, asset) => {
              material.setProperty('subPattern', asset);
              done();
            });
          });
        }
        if (props.subPattern2) {
          tasks.push(done => {
            app.assets.load(props.subPattern2, (err, asset) => {
              material.setProperty('subPattern2', asset);
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
        material.effect = app.assets.get('builtin-effect-matcap');

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
              material.setProperty('mainTex', asset);
              material.define('USE_MAIN_TEX', true);
              done();
            });
          });
        }
        if (props.matcapTex) {
          tasks.push(done => {
            app.assets.load(props.matcapTex, (err, asset) => {
              material.setProperty('matcapTex', asset);
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
        material.effect = app.assets.get('builtin-effect-pbr');

        material.setProperty('albedo', color4.new(
            props.albedo[0],
            props.albedo[1],
            props.albedo[2],
            props.albedo[3]
          )
        );

        if (props.mainTiling) {
          material.setProperty('mainTiling', vec2.new(
              props.mainTiling[0],
              props.mainTiling[1]
            )
          );
        }

        if (props.mainOffset) {
          material.setProperty('mainOffset', vec2.new(
              props.mainOffset[0],
              props.mainOffset[1]
            )
          );
        }

        if (props.metallic) {
          material.setProperty('metallic', props.metallic);
        }

        if (props.roughness) {
          material.setProperty('roughness', props.roughness);
        }

        if (props.ao) {
          material.setProperty('ao', props.ao);
        }

        material.define('USE_EMISSIVE', props.USE_EMISSIVE);
        if (props.emissive) {
          material.setProperty('emissive', color3.new(
              props.emissive[0],
              props.emissive[1],
              props.emissive[2]
            )
          );
        }

        // textures
        let tasks = [];

        material.define('USE_ALBEDO_TEXTURE', props.USE_ALBEDO_TEXTURE);
        if (props.albedo_texture) {
          tasks.push(done => {
            app.assets.load(props.albedo_texture, (err, asset) => {
              material.setProperty('albedo_texture', asset);
              done();
            });
          });
        }

        material.define('USE_METALLIC_TEXTURE', props.USE_METALLIC_TEXTURE);
        if (props.metallic_texture) {
          tasks.push(done => {
            app.assets.load(props.metallic_texture, (err, asset) => {
              material.setProperty('metallic_texture', asset);
              done();
            });
          });
        }

        material.define('USE_ROUGHNESS_TEXTURE', props.USE_ROUGHNESS_TEXTURE);
        if (props.roughness_texture) {
          tasks.push(done => {
            app.assets.load(props.roughness_texture, (err, asset) => {
              material.setProperty('roughness_texture', asset);
              done();
            });
          });
        }

        material.define('USE_NORMAL_TEXTURE', props.USE_NORMAL_TEXTURE);
        if (props.normal_texture) {
          tasks.push(done => {
            app.assets.load(props.normal_texture, (err, asset) => {
              material.setProperty('normal_texture', asset);
              done();
            });
          });
        }

        material.define('USE_AO_TEXTURE', props.USE_AO_TEXTURE);
        if (props.ao_texture) {
          tasks.push(done => {
            app.assets.load(props.ao_texture, (err, asset) => {
              material.setProperty('ao_texture', asset);
              done();
            });
          });
        }

        material.define('USE_EMISSIVE_TEXTURE', props.USE_EMISSIVE_TEXTURE);
        if (props.emissive_texture) {
          tasks.push(done => {
            app.assets.load(props.emissive_texture, (err, asset) => {
              material.setProperty('emissive_texture', asset);
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

      } else if (json.type.startsWith('particle')) {
        material.effect = app.assets.get(`builtin-effect-${json.type}`);

        // values
        if (props.tintColor) {
          material.setProperty('tintColor', color4.new(
              props.tintColor[0],
              props.tintColor[1],
              props.tintColor[2],
              props.tintColor[3]
            )
          );
        }

        if (props.mainTiling) {
          material.setProperty('mainTiling', vec2.new(
              props.mainTiling[0],
              props.mainTiling[1]
            )
          );
        }

        if (props.mainOffset) {
          material.setProperty('mainOffset', vec2.new(
              props.mainOffset[0],
              props.mainOffset[1]
            )
          );
        }

        let tasks = [];

        // assets
        if (props.mainTexture) {
          tasks.push(done => {
            app.assets.load(props.mainTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('mainTexture', asset);
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
      } else { // TODO: support other materials that maybe loaded from assets.
        console.error('unsupported material loading');
      }
    }
  });
}
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

        if (props.specularColor) {
          material.setProperty('specularColor', color4.new(
              props.specularColor[0],
              props.specularColor[1],
              props.specularColor[2],
              props.specularColor[3]
            )
          );
        }

        if (props.specularTiling) {
          material.setProperty('specularTiling', vec2.new(
              props.specularTiling[0],
              props.specularTiling[1]
            )
          );
        }

        if (props.specularOffset) {
          material.setProperty('specularOffset', vec2.new(
              props.specularOffset[0],
              props.specularOffset[1]
            )
          );
        }

        if (props.emissiveColor) {
          material.setProperty('emissiveColor', color4.new(
              props.emissiveColor[0],
              props.emissiveColor[1],
              props.emissiveColor[2],
              props.emissiveColor[3]
            )
          );
        }

        if (props.emissiveTiling) {
          material.setProperty('emissiveTiling', vec2.new(
              props.emissiveTiling[0],
              props.emissiveTiling[1]
            )
          );
        }

        if (props.emissiveOffset) {
          material.setProperty('emissiveOffset', vec2.new(
              props.emissiveOffset[0],
              props.emissiveOffset[1]
            )
          );
        }

        if (props.normalTiling) {
          material.setProperty('normalTiling', vec2.new(
              props.normalTiling[0],
              props.normalTiling[1]
            )
          );
        }

        if (props.normalOffset) {
          material.setProperty('normalOffset', vec2.new(
              props.normalOffset[0],
              props.normalOffset[1]
            )
          );
        }

        if (props.glossiness) {
          material.setProperty('glossiness', props.glossiness);
        }

        let tasks = [];

        // assets
        material.define('USE_DIFFUSE_TEXTURE', props.USE_DIFFUSE_TEXTURE);
        if (props.diffuseTexture) {
          tasks.push(done => {
            app.assets.load(props.diffuseTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('diffuseTexture', asset);
              done();
            });
          });
        }

        material.define('USE_SPECULAR_TEXTURE', props.USE_SPECULAR_TEXTURE);
        if (props.specularTexture) {
          tasks.push(done => {
            app.assets.load(props.specularTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('specularTexture', asset);
              done();
            });
          });
        }

        material.define('USE_EMISSIVE_TEXTURE', props.USE_EMISSIVE_TEXTURE);
        if (props.emissiveTexture) {
          tasks.push(done => {
            app.assets.load(props.emissiveTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('emissiveTexture', asset);
              done();
            });
          });
        }

        material.define('USE_NORMAL_TEXTURE', props.USE_NORMAL_TEXTURE);
        if (props.normalTexture) {
          tasks.push(done => {
            app.assets.load(props.normalTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.setProperty('normalTexture', asset);
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

        if (props.albedoTiling) {
          material.setProperty('albedoTiling', vec2.new(
              props.albedoTiling[0],
              props.albedoTiling[1]
            )
          );
        }

        if (props.albedoOffset) {
          material.setProperty('albedoOffset', vec2.new(
              props.albedoOffset[0],
              props.albedoOffset[1]
            )
          );
        }

        if (props.metallic) {
          material.setProperty('metallic', props.metallic);
        }

        if (props.metallicTiling) {
          material.setProperty('metallicTiling', vec2.new(
              props.metallicTiling[0],
              props.metallicTiling[1]
            )
          );
        }

        if (props.metallicOffset) {
          material.setProperty('metallicOffset', vec2.new(
              props.metallicOffset[0],
              props.metallicOffset[1]
            )
          );
        }

        if (props.roughness) {
          material.setProperty('roughness', props.roughness);
        }

        if (props.roughnessTiling) {
          material.setProperty('roughnessTiling', vec2.new(
              props.roughnessTiling[0],
              props.roughnessTiling[1]
            )
          );
        }

        if (props.roughnessOffset) {
          material.setProperty('roughnessOffset', vec2.new(
              props.roughnessOffset[0],
              props.roughnessOffset[1]
            )
          );
        }

        if (props.ao) {
          material.setProperty('ao', props.ao);
        }

        if (props.aoTiling) {
          material.setProperty('aoTiling', vec2.new(
              props.aoTiling[0],
              props.aoTiling[1]
            )
          );
        }

        if (props.aoOffset) {
          material.setProperty('aoOffset', vec2.new(
              props.aoOffset[0],
              props.aoOffset[1]
            )
          );
        }

        if (props.normalTiling) {
          material.setProperty('normalTiling', vec2.new(
              props.normalTiling[0],
              props.normalTiling[1]
            )
          );
        }

        if (props.normalOffset) {
          material.setProperty('normalOffset', vec2.new(
              props.normalOffset[0],
              props.normalOffset[1]
            )
          );
        }

        // textures
        let tasks = [];

        material.define('USE_ALBEDO_TEXTURE', props.USE_ALBEDO_TEXTURE);
        if (props.albedoTexture) {
          tasks.push(done => {
            app.assets.load(props.albedoTexture, (err, asset) => {
              material.setProperty('albedoTexture', asset);
              done();
            });
          });
        }

        material.define('USE_METALLIC_TEXTURE', props.USE_METALLIC_TEXTURE);
        if (props.metallicTexture) {
          tasks.push(done => {
            app.assets.load(props.metallicTexture, (err, asset) => {
              material.setProperty('metallicTexture', asset);
              done();
            });
          });
        }

        material.define('USE_ROUGHNESS_TEXTURE', props.USE_ROUGHNESS_TEXTURE);
        if (props.roughnessTexture) {
          tasks.push(done => {
            app.assets.load(props.roughnessTexture, (err, asset) => {
              material.setProperty('roughnessTexture', asset);
              done();
            });
          });
        }

        material.define('USE_NORMAL_TEXTURE', props.USE_NORMAL_TEXTURE);
        if (props.normalTexture) {
          tasks.push(done => {
            app.assets.load(props.normalTexture, (err, asset) => {
              material.setProperty('normalTexture', asset);
              done();
            });
          });
        }

        material.define('USE_AO_TEXTURE', props.USE_AO_TEXTURE);
        if (props.aoTexture) {
          tasks.push(done => {
            app.assets.load(props.aoTexture, (err, asset) => {
              material.setProperty('aoTexture', asset);
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
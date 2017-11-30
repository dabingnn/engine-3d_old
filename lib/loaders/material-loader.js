import { vec2, color4 } from 'vmath';
import PhongMaterial from '../materials/phong-material';
import MatcapMaterial from '../materials/matcap-material';
import PbrMaterial from '../materials/pbr-material';
import GridMaterial from '../materials/grid-material';
import UnlitMaterial from '../materials/unlit-material';
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

      let material = null;
      const props = json.properties;

      if (json.type === 'unlit') {
        material = new UnlitMaterial();

        // values
        if (props.color) {
          material.color = color4.new(
            props.color[0],
            props.color[1],
            props.color[2],
            props.color[3]
          );
        }

        if (props.mainTextureTiling) {
          material.mainTextureTiling = vec2.new(
            props.mainTextureTiling[0],
            props.mainTextureTiling[1]
          );
        }

        if (props.mainTextureOffset) {
          material.mainTextureOffset = vec2.new(
            props.mainTextureOffset[0],
            props.mainTextureOffset[1]
          );
        }

        let tasks = [];

        // assets
        if (props.mainTexture) {
          tasks.push(done => {
            app.assets.load(props.mainTexture, (err, asset) => {
              // TODO: just set the texture instead
              material.mainTexture = asset;
              material.useTexture = true;
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
        material = new PhongMaterial();

        // values
        if (props.diffuseColor) {
          material.diffuseColor = color4.new(
            props.diffuseColor[0],
            props.diffuseColor[1],
            props.diffuseColor[2],
            props.diffuseColor[3]
          );
        }

        if (props.diffuseTiling) {
          material.diffuseTiling = vec2.new(
            props.diffuseTiling[0],
            props.diffuseTiling[1]
          );
        }

        if (props.diffuseOffset) {
          material.diffuseOffset = vec2.new(
            props.diffuseOffset[0],
            props.diffuseOffset[1]
          );
        }

        let tasks = [];

        // assets
        if (props.diffuse) {
          tasks.push(done => {
            app.assets.load(props.diffuse, (err, asset) => {
              // TODO: just set the texture instead
              material.diffuseTexture = asset;
              material.useDiffuseTexture = true;
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
        material = new GridMaterial();

        material.useWorldPos = props.useWorldPos;
        material.tiling = vec2.new(props.tilingX, props.tilingY);
        material.baseColorBlack = color4.new(
          props.baseColorBlack[0],
          props.baseColorBlack[1],
          props.baseColorBlack[2],
          props.baseColorBlack[3]
        );
        material.baseColorWhite = color4.new(
          props.baseColorWhite[0],
          props.baseColorWhite[1],
          props.baseColorWhite[2],
          props.baseColorWhite[3]
        );
        material.subPatternColor = color4.new(
          props.subPatternColor[0],
          props.subPatternColor[1],
          props.subPatternColor[2],
          props.subPatternColor[3]
        );
        material.subPatternColor2 = color4.new(
          props.subPatternColor2[0],
          props.subPatternColor2[1],
          props.subPatternColor2[2],
          props.subPatternColor2[3]
        );

        material.basePatternTiling = vec2.new(
          props.basePatternTiling[0],
          props.basePatternTiling[1]
        );
        material.basePatternOffset = vec2.new(
          props.basePatternOffset[0],
          props.basePatternOffset[1]
        );

        material.subPatternTiling = vec2.new(
          props.subPatternTiling[0],
          props.subPatternTiling[1]
        );
        material.subPatternOffset = vec2.new(
          props.subPatternOffset[0],
          props.subPatternOffset[1]
        );

        material.subPattern2Tiling = vec2.new(
          props.subPattern2Tiling[0],
          props.subPattern2Tiling[1]
        );
        material.subPattern2Offset = vec2.new(
          props.subPattern2Offset[0],
          props.subPattern2Offset[1]
        );

        // HACK: we should have a way to set default texture
        app.assets.load('black-texture', (err, asset) => {
          material.basePattern = asset;
          material.subPattern = asset;
          material.subPattern2 = asset;
        });

        // textures
        let tasks = [];
        if (props.basePattern) {
          tasks.push(done => {
            app.assets.load(props.basePattern, (err, asset) => {
              material.basePattern = asset;
              done();
            });
          });
        }
        if (props.subPattern) {
          tasks.push(done => {
            app.assets.load(props.subPattern, (err, asset) => {
              material.subPattern = asset;
              done();
            });
          });
        }
        if (props.subPattern2) {
          tasks.push(done => {
            app.assets.load(props.subPattern2, (err, asset) => {
              material.subPattern2 = asset;
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
        material = new MatcapMaterial();

        // values
        if (props.colorFactor) {
          material.colorFactor = props.colorFactor;
        }
        if (props.color) {
          material.color = color4.new(
            props.color[0],
            props.color[1],
            props.color[2],
            props.color[3]
          );
        }

        // textures
        let tasks = [];

        if (props.mainTex) {
          tasks.push(done => {
            app.assets.load(props.mainTex, (err, asset) => {
              material.mainTex = asset;
              material.useMainTex = true;
              done();
            });
          });
        }
        if (props.matcapTex) {
          tasks.push(done => {
            app.assets.load(props.matcapTex, (err, asset) => {
              material.matcapTex = asset;
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
        material = new PbrMaterial();

        // textures
        let tasks = [];

        if (props.albedoTexture) {
          tasks.push(done => {
            app.assets.load(props.albedoTexture, (err, asset) => {
              material.albedoTexture = asset;
              material.useAlbedoTexture = true;
              done();
            });
          });
        }
        if (props.metallicTexture) {
          tasks.push(done => {
            app.assets.load(props.metallicTexture, (err, asset) => {
              material.metallicTexture = asset;
              material.useMetallicTexture = true;
              done();
            });
          });
        }
        if (props.roughnessTexture) {
          tasks.push(done => {
            app.assets.load(props.roughnessTexture, (err, asset) => {
              material.roughnessTexture = asset;
              material.useRoughnessTexture = true;
              done();
            });
          });
        }
        if (props.normalTexture) {
          tasks.push(done => {
            app.assets.load(props.normalTexture, (err, asset) => {
              material.normalTexture = asset;
              material.useNormalTexture = true;
              done();
            });
          });
        }
        if (props.aoTexture) {
          tasks.push(done => {
            app.assets.load(props.aoTexture, (err, asset) => {
              material.aoTexture = asset;
              material.useAoTexture = true;
              done();
            });
          });
        }
        if (props.opacityTexture) {
          tasks.push(done => {
            app.assets.load(props.opacityTexture, (err, asset) => {
              material.opacityTexture = asset;
              material.useOpacityTexture = true;
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
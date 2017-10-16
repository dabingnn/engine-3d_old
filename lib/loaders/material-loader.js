import { vec2, color4 } from 'vmath';
import PhongMaterial from '../materials/phong-material';
import MatcapMaterial from '../materials/matcap-material';
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

      if (json.type === 'phong') {
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
      } else if (json.type === 'matcap') {
        material = new MatcapMaterial();

        // values
        if (props.colorFactor) {
          material.colorFactor = props.colorFactor;
        }
        if (props.color) {
          material.color = props.color;
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
        if(props.matcapTex) {
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
      } else { // TODO: support other materials that maybe loaded from assets.
        console.error('unsupported material loading');
      }
    }
  });
}
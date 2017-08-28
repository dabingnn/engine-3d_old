import { vec2, color4 } from 'vmath';
import PhongMaterial from '../materials/phong-material';
import resl from '../misc/resl';
import async from '../misc/async';

export default function(app, urls, callback) {
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
        let values = {};

        // values
        if (props.diffuseColor) {
          values.diffuseColor = color4.new(
            props.diffuseColor[0],
            props.diffuseColor[1],
            props.diffuseColor[2],
            props.diffuseColor[3]
          );
        }

        if (props.diffuseTiling) {
          values.diffuseTiling = vec2.new(
            props.diffuseTiling[0],
            props.diffuseTiling[1]
          );
        }

        if (props.diffuseOffset) {
          values.diffuseOffset = vec2.new(
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
              values.diffuseTexture = asset;
              done();
            });
          });
        }

        async.parallel(tasks, err => {
          if (err) {
            console.error(err);
          }

          material = new PhongMaterial(values);
          material.useDiffuseTexture = props.diffuse !== undefined;

          callback(null, material);
        });
      }
    }
  });
}
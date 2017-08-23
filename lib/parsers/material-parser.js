import { vec2, color4 } from 'vmath';
import gfx from 'gfx.js';
import PhongMaterial from '../materials/phong-material';
import resl from '../misc/resl';
import path from '../misc/path';

export default function(app, json, baseUrl, callback) {
  let material = null;
  const props = json.properties;

  if (json.type === 'phong') {
    let values = {};
    let manifest = {};

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

    // assets
    if (props.diffuse) {
      manifest.diffuseJson = {
        type: 'text',
        parser: JSON.parse,
        src: path.join(baseUrl, props.diffuse.urls.json),
      };
      manifest.diffuseImage = {
        type: 'image',
        src: path.join(baseUrl, props.diffuse.urls.image),
      };
    }

    // load textures
    resl({
      manifest,
      onDone(data) {
        if (data.diffuseJson && data.diffuseImage) {
          const image = data.diffuseImage;
          let texture = new gfx.Texture2D(app.device, {
            width: image.width,
            height: image.height,
            wrapS: gfx.WRAP_CLAMP,
            wrapT: gfx.WRAP_CLAMP,
            mipmap: true,
            images: [image]
          });

          values.diffuseTexture = texture;
        }

        //
        material = new PhongMaterial(values);
        material.useDiffuseTexture = props.diffuse !== undefined;

        callback(null, material);
      }
    });
  }
}
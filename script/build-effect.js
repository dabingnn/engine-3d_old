'use strict';

const path_ = require('path');
const fs = require('fs');
const fsJetpack = require('fs-jetpack');

const renderer = require('renderer.js');
const gfx = require('gfx.js');

const _typeMap = {
  float: renderer.PARAM_FLOAT,
  float2: renderer.PARAM_FLOAT2,
  float3: renderer.PARAM_FLOAT3,
  float4: renderer.PARAM_FLOAT4,
  color3: renderer.PARAM_COLOR3,
  color4: renderer.PARAM_COLOR4,
  texture2d: renderer.PARAM_TEXTURE_2D,
  textureCube: renderer.PARAM_TEXTURE_CUBE
};

const _passMap = {
  back: gfx.CULL_BACK,
  front: gfx.CULL_FRONT,
  none: gfx.CULL_NONE,
  add: gfx.BLEND_FUNC_ADD,
  subtract: gfx.BLEND_FUNC_SUBTRACT,
  reverseSubtract: gfx.BLEND_FUNC_REVERSE_SUBTRACT,
  zero: gfx.BLEND_ZERO,
  one: gfx.BLEND_ONE,
  srcColor: gfx.BLEND_SRC_COLOR,
  oneMinusSrcColor: gfx.BLEND_ONE_MINUS_SRC_COLOR,
  dstColor: gfx.BLEND_DST_COLOR,
  oneMinusDstColor: gfx.BLEND_ONE_MINUS_DST_COLOR,
  srcAlpha: gfx.BLEND_SRC_ALPHA,
  oneMinusSrcAlpha: gfx.BLEND_ONE_MINUS_SRC_ALPHA,
  dstAlpha: gfx.BLEND_DST_ALPHA,
  oneMinusDstAlpha: gfx.BLEND_ONE_MINUS_DST_ALPHA,
  constColor: gfx.BLEND_CONSTANT_COLOR,
  oneMinusConstColor: gfx.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constAlpha: gfx.BLEND_CONSTANT_ALPHA,
  oneMinusConstAlpha: gfx.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  srcAlphaSaturate: gfx.BLEND_SRC_ALPHA_SATURATE,
  [true]: true,
  [false]: false
};

function buildEffects(dest, path) {
  let files = fsJetpack.find(path, { matching: ['**/*.json'] });
  let code = '';
  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    let dir = path_.dirname(file);
    let name = path_.basename(file, '.json');

    let json = fs.readFileSync(path_.join(dir, name + '.json'), { encoding: 'utf8' });
    json = JSON.parse(json);
    // map param's type offline.
    for (let j = 0; j < json.techniques.length; ++j) {
      let jsonTech = json.techniques[j];
      for (let k = 0; k < jsonTech.params.length; ++k) {
        let param = jsonTech.params[k];
        param.type = _typeMap[param.type];
      }
      for (let k = 0; k < jsonTech.passes.length; ++k) {
        let pass = jsonTech.passes[k];
        for (let key in pass) {
          if (key === "program") {
            continue;
          }
          pass[key] = _passMap[pass[key]];
        }
      }
    }

    code += '  {\n';
    code += `    name: '${name}',\n`;
    code += `    techniques: ${JSON.stringify(json.techniques)},\n`;
    code += `    properties: ${JSON.stringify(json.properties)},\n`;
    code += `    defines: ${JSON.stringify(json.defines)}\n`;
    code += '  },\n';
  }
  code = `export default [\n${code}];`;

  //console.log(`code =  ${code}`);
  fs.writeFileSync(dest, code, { encoding: 'utf8' });
}

// ============================================================
// build
// ============================================================

let effectsPath = './lib/builtin/effects';
let effectsFile = path_.join(effectsPath, 'index.js');
console.log(`generate ${effectsFile}`);
buildEffects(effectsFile, effectsPath);
import Mesh from './assets/mesh';

import parseMesh from './parsers/mesh-parser';
import parseMaterial from './parsers/material-parser';
import parseSkinning from './parsers/skinning-parser';
import parseAnim from './parsers/animation-parser';
import parseLevel from './parsers/level-parser';

import ShaderMaterial from './materials/shader-material';
import renderer from 'renderer.js';
import gfx from 'gfx.js';
import { color4 } from 'vmath';

function createGrid(device, node, width, length, seg) {
  // create mesh
  let vertices = [];
  let hw = width * 0.5;
  let hl = length * 0.5;
  let dw = width / seg;
  let dl = length / seg;

  for (let x = -hw; x <= hw; x += dw) {
    vertices.push(x, 0, -hl);
    vertices.push(x, 0, hl);
  }

  for (let z = -hl; z <= hl; z += dl) {
    vertices.push(-hw, 0, z);
    vertices.push(hw, 0, z);
  }

  let mesh = renderer.createMesh(device, {
    positions: vertices
  });
  mesh._primitiveType = gfx.PT_LINES;

  let material = new ShaderMaterial(
    'simple',
    [
      { name: 'color', type: renderer.PARAM_COLOR4, },
    ],
    {
      color: color4.new(0.4, 0.4, 0.4, 1.0),
    }
  );
  material.setOption('useTexture', false);
  material.setOption('useColor', true);
  material.setDepth(true, true);

  let model = new renderer.Model();
  model.addMesh(mesh);
  model.addEffect(material._effect);
  model.setNode(node);

  return model;
}

function createJointsTexture(device, skinning) {
  const jointCount = skinning._jointIndices.length;

  // set jointsTexture
  let size;
  if (jointCount > 256) {
    size = 64;
  } else if (jointCount > 64) {
    size = 32;
  } else if (jointCount > 16) {
    size = 16;
  } else {
    size = 8;
  }

  return new gfx.Texture2D(device, {
    width: size,
    height: size,
    format: gfx.TEXTURE_FMT_RGBA32F,
    minFilter: gfx.FILTER_NEAREST,
    magFilter: gfx.FILTER_NEAREST,
    wrapS: gfx.WRAP_CLAMP,
    wrapT: gfx.WRAP_CLAMP,
    mipmap: false,
  });
}

function createMesh(app, data) {
  let mesh = renderer.createMesh(app.device, data);
  let meshAsset = new Mesh();
  meshAsset._subMeshes = [mesh];

  return meshAsset;
}

export default {
  createGrid,
  createJointsTexture,

  // create assets
  createMesh,

  // parse assets
  parseMesh,
  parseMaterial,
  parseSkinning,
  parseAnim,
  parseLevel,
};
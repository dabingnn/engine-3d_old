import loadMesh from './loaders/mesh-loader';
import loadMaterial from './loaders/material-loader';
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

export default {
  createGrid,
  loadMesh,
  loadMaterial,
  createMesh: renderer.createMesh,
};
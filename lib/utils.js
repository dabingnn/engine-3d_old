import renderer from 'renderer.js';
import gfx from 'gfx.js';
import { color4 } from 'vmath';

function createGrid (device, node, width, length, seg) {
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

  let pass = new renderer.Pass('simple');
  pass.setDepth(true, true);
  let technique = new renderer.Technique(
    renderer.STAGE_OPAQUE,
    [
      { name: 'color', type: renderer.PARAM_COLOR4, },
    ],
    [
      pass
    ]
  );
  let material = new renderer.Material(
    [
      technique
    ],
    {
      color: color4.new(0.4, 0.4, 0.4, 1.0),
    },
    {
      useTexture: false,
      useColor: true,
    }
  );

  let model = new renderer.Model();
  model.addMesh(mesh);
  model.addMaterial(material);
  model.setNode(node);

  return model;
}

export default {
  createGrid,
  createMesh: renderer.createMesh,
  parseMaterial: renderer.parseMaterial,
};
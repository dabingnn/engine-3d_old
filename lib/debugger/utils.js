import renderer from 'renderer.js';
import gfx from 'gfx.js';
import { color4 } from 'vmath';
import { Node } from 'scene-graph';
import ShaderMaterial from '../materials/shader-material';

export function createGrid(device, width, length, seg) {
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

  let ia = renderer.createIA(device, {
    positions: vertices
  });
  ia._primitiveType = gfx.PT_LINES;

  let material = new ShaderMaterial(
    'simple',
    [
      { name: 'color', type: renderer.PARAM_COLOR4, },
    ],
    [
      { name: 'useTexture', value: false },
      { name: 'useColor', value: true }
    ]
  );
  material.setDepth(true, true);
  material.setValue('color', color4.new(0.4, 0.4, 0.4, 1.0));

  let model = new renderer.Model();
  model.addInputAssembler(ia);
  model.addEffect(material._effect);
  model.setNode(new Node('debug-grid'));

  return model;
}
import renderer from 'renderer.js';
import gfx from 'gfx.js';
import { Node } from 'scene-graph';
import Material from '../assets/material';

export function createGrid(app, width, length, seg) {
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

  let ia = renderer.createIA(app.device, {
    positions: vertices
  });
  ia._primitiveType = gfx.PT_LINES;

  let material = new Material();
  material.effectAsset = app.assets.get('builtin-simple');

  let model = new renderer.Model();
  model.addInputAssembler(ia);
  model.addEffect(material.effectAsset.effect);
  model.setNode(new Node('debug-grid'));

  return model;
}
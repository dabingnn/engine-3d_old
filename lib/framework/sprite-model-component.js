import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import SpriteMaterial from '../materials/sprite-material';
import gfx from 'gfx.js';
import { vec3, color4, mat4 } from 'vmath';

const _defaultWidth = 64;
const _defaultHeight = 64;

function _generateVerts(width, height, verts) {
  verts[0] = 0;
  verts[1] = 0;
  verts[2] = 0;
  verts[3] = 0;

  verts[4] = width;
  verts[5] = 0;
  verts[6] = 1;
  verts[7] = 0;

  verts[8] = 0;
  verts[9] = height;
  verts[10] = 0;
  verts[11] = 1;

  verts[12] = width;
  verts[13] = height;
  verts[14] = 1;
  verts[15] = 1;

}

export default class SpriteModelComponent extends Component {
  constructor() {
    super();

    this._material = new SpriteMaterial();
    this._material.useColor = true;
    this._material.color = color4.create();
    this._model = new renderer.Model();
    this._model.addEffect(this._material._effect);
    this._verts = new Float32Array(4 * 4);  // floatper size * number vertices
    this._ia = null;
    this._width = _defaultWidth;
    this._height = _defaultHeight;
  }

  onInit() {
    this._model.setNode(this._entity);
    let ia = new renderer.InputAssembler(this._getSpriteVertexBuffer(), this._getSpriteIndexBuffer());
    this._ia = ia;
    this._model.addInputAssembler(ia);
  }

  _getSpriteIndexBuffer() {
    let indices = new Uint8Array([0, 1, 2, 3, 2, 1]);
    return new gfx.IndexBuffer(this._engine.device, gfx.INDEX_FMT_UINT8, gfx.USAGE_STATIC, indices, indices.length);
  }

  _getSpriteVertexBuffer() {
    _generateVerts(this._width, this._height, this._verts);
    let fmt = [];
    fmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    fmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    return new gfx.VertexBuffer(this._engine.device, new gfx.VertexFormat(fmt), gfx.USAGE_STATIC, this._verts, 4);
  }

  set texture(val) {
    if (val) {
      this._material.useTexture = true;
      this._material.mainTexture = val;
    } else {
      this._material.useTexture = false;
      // this._material.mainTexture = val;
    }
  }

  set color(val) {
    this._material.color = val;
  }

  // todo. update width and height info notification
  // todo. use a more elegant way to update VB
  set width(val) {
    this._width = val;
    _generateVerts(this._width, this._height, this._verts);
    this._ia._vertexBuffer.update(0, this._verts);
  }

  set height(val) {
    this._height = val;
    _generateVerts(this._width, this._height, this._verts);
    this._ia._vertexBuffer.update(0, this._verts);
  }

  // todo. move vb,ib to renderer level later and we do not need to destroy vb and ib here
  destroy() {
    this._ia._indexBuffer.destroy();
    this._ia._vertexBuffer.destroy();
    super.destroy();
  }
}
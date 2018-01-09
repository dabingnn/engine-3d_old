import renderer from 'renderer.js';
import { Node } from 'scene-graph';
import { RecyclePool } from 'memop';
import Material from '../../assets/material';

class StencilManager {
  constructor() {
    // todo: 8 is least Stencil depth supported by webGL device, it could be adjusted to vendor implementation value
    this._maxLevel = 8;
    // 0 means current not in a mask
    this._currentLevel = 0;
  }

  enterLevel() {
    this._currentLevel++;
    if (this._currentLevel > this._maxLevel) {
      console.error(`Stencil manager does not support level bigger than ${this._maxLevel} in this device.`);
    }
  }

  exitLevel() {
    this._currentLevel--;
    if (this._currentLevel < 0) {
      console.error(`Exit too many mask levels`);
    }
  }

  get inStencil() {
    return this._currentLevel > 0;
  }

  get stencilWriteMask() {
    return 0x01 << (this._currentLevel - 1);
  }

  get stencilRef() {
    let result = 0;
    for (let i = 0; i < this._currentLevel; ++i) {
      result += (0x01 << i);
    }
    return result;
  }
}

export default class ScreenRenderHelper {

  constructor() {
    this._stencilMgr = new StencilManager();

    this._materialPool = new RecyclePool(() => {
      return new Material();
    }, 100);
    this._spriteBatchModelPool = new RecyclePool(() => {
      return new renderer.SpriteBatchModel();
    }, 100);

    // internal states
    this._dummyNode = new Node();
    this._scene = null;
    this._screen = null;
    this._curMaterail = null;
    this._curTexture = null;
    this._curSpriteBatch = null;
  }

  reset () {
    for (let i = 0; i < this._spriteBatchModelPool.length; ++i) {
      let spriteBatch = this._spriteBatchModelPool.data[i];
      spriteBatch.clear();
      this._scene.removeModel(spriteBatch);
    }

    this._materialPool.reset();
    this._spriteBatchModelPool.reset();

    this._scene = null;
    this._screen = null;
    this._curMaterail = null;
    this._curTexture = null;
    this._curSpriteBatch = null;
  }

  _cloneMaterial(rawMaterial) {
    let mat = this._materialPool.add();
    mat.copy(rawMaterial);

    return mat;
  }

  _getSpriteBatchModel(material, texture) {
    if (
      this._curSpriteBatch !== null &&
      this._curMaterail === material &&
      this._curTexture === texture
    ) {
      return this._curSpriteBatch;
    }

    let spriteBatch = this._spriteBatchModelPool.add();
    let mat = this._cloneMaterial(material);
    mat.setProperty('mainTexture', texture);
    spriteBatch.setNode(this._dummyNode);
    spriteBatch.setEffect(mat.effectInst);
    spriteBatch._viewID = this._screen._view._id;

    this._scene.addModel(spriteBatch);

    //
    this._curMaterail = material;
    this._curTexture = texture;
    this._curSpriteBatch = spriteBatch;

    return spriteBatch;
  }

  addImage(widget, image) {
    let vdata = image.calcVertexData(
      widget._rect.x,
      widget._rect.y,
      widget._rect.w,
      widget._rect.h
    );

    let spriteBatch = this._getSpriteBatchModel(image.material, image.sprite.texture);
    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );
  }

  addText(widget, text) {
    let vdata = text.calcVertexData(
      widget._rect.x,
      widget._rect.y,
      widget._rect.w,
      widget._rect.h
    );

    let spriteBatch = this._getSpriteBatchModel(text.material, text.font.texture);
    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );
  }

  // beginScreen(screen) {
  //   this._currentScreen = screen;
  // }

  // endScreen() {
  //   this._flush();
  //   this._currentScreen = null;
  //   this._sortKey = 0;
  // }

  // addItem(renderData) {
  //   // fast return
  //   if (!renderData || renderData.getVertexCount() === 0 || renderData.getIndexCount() === 0) {
  //     return;
  //   }
  //   let positions = renderData.getPositions();
  //   let uvs = renderData.getUVs();
  //   let color = renderData.getColor();
  //   let node = renderData.getNode();
  //   if (this._vb === null || this._ib === null) {
  //     this._vb = this._vbPool.add();
  //     this._ib = this._ibPool.add();
  //   }
  //   let ia = this._iaPool.add();
  //   node.getWorldMatrix(_m4_tmp);
  //   if (renderData.getVertexCount() + this._vertexOffset > _vertsInIAPool || renderData.getIndexCount() + this._indexOffset > _indicesInIAPool) {
  //     this._flush();
  //     this._vb = this._vbPool.add();
  //     this._ib = this._ibPool.add();
  //   }
  //   let multiplyTransform = renderData.getVertexCount() < _multiplyTransformVertexThreshold;
  //   for (let i = 0; i < renderData.getVertexCount(); ++i) {
  //     let position = positions[i];
  //     if (multiplyTransform) {
  //       vec3.transformMat4(_v3_tmp, positions[i], _m4_tmp);
  //       position = _v3_tmp;
  //     }
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert] = position.x;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 1] = position.y;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 2] = uvs[i].x;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 3] = uvs[i].y;

  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 4] = color.r;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 5] = color.g;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 6] = color.b;
  //     this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 7] = color.a;
  //   }
  //   let indices = renderData.getIndices();
  //   for (let i = 0; i < renderData.getIndexCount(); ++i) {
  //     this._batchedIndices[this._indexOffset + i] = indices[i] + this._vertexOffset;
  //   }
  //   renderData._ia = ia;
  //   renderData._multiplyTransform = multiplyTransform;
  //   this._batchedItems.push(renderData);
  //   ia._vertexBuffer = this._vb;
  //   ia._indexBuffer = this._ib;
  //   ia._start = this._indexOffset;
  //   ia._count = renderData.getIndexCount();
  //   this._vertexOffset = this._vertexOffset + renderData.getVertexCount();
  //   this._indexOffset = this._indexOffset + renderData.getIndexCount();
  // }

  // _flush() {
  //   if (this._batchedItems.length > 0) {
  //     this._vb.update(0, this._batchedVerts);
  //     this._ib.update(0, this._batchedIndices);
  //   }
  //   for (let i = 0; i < this._batchedItems.length; ++i) {
  //     let item = this._batchedItems[i];
  //     let nextItem = this._batchedItems[i + 1];
  //     if (nextItem && item.batchTest(nextItem)) {
  //       // do batch
  //       nextItem._ia._start = item._ia._start;
  //       nextItem._ia._count = nextItem._ia._count + item._ia._count;
  //     } else {
  //       this._submit(item);
  //     }
  //     item._ia = null;
  //   }
  //   this._vb = null;
  //   this._ib = null;
  //   this._batchedItems.length = 0;
  //   this._vertexOffset = this._indexOffset = 0;
  // }

  // _submit(renderData) {
  //   let model = this._modelPool.add();
  //   this._usedModels.push(model);
  //   model.sortKey = this._sortKey++;
  //   model._viewID = this._currentScreen._view._id;
  //   model.setNode(renderData._multiplyTransform ? this._dummyNode : renderData.getNode());
  //   model.setEffect(renderData.getEffect());
  //   model.setInputAssembler(renderData._ia);
  //   this._app.scene.addModel(model);
  // }

  // reset() {
  //   this._iaPool.reset();
  //   this._vbPool.reset();
  //   this._ibPool.reset();
  //   let scene = this._app.scene;
  //   for (let i = 0; i < this._usedModels.length; ++i) {
  //     // remove from scene
  //     this._usedModels[i].setInputAssembler(null);
  //     this._usedModels[i].setEffect(null);
  //     scene.removeModel(this._usedModels[i]);
  //   }
  //   this._modelPool.reset();
  //   this._usedModels.length = 0;
  // }
}
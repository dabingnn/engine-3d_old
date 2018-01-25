import gfx from 'gfx.js';
import renderer from 'renderer.js';
import { Node } from 'scene-graph';
import { RecyclePool } from 'memop';
import Material from '../../assets/material';

const MAX_STENCIL_LEVEL = 8;

function _setStencil(mat, func, ref, mask, failOp, zFailOp, zPassOp, writeMask) {
  let tech = mat.effectInst.getTechnique('ui');
  for (let i = 0; i < tech.passes.length; ++i) {
    let pass = tech.passes[i];
    pass.setStencilFront(
      func, ref, mask, failOp, zFailOp, zPassOp, writeMask
    );
    pass.setStencilBack(
      func, ref, mask, failOp, zFailOp, zPassOp, writeMask
    );
  }
}

export default class ScreenRenderHelper {
  constructor(app) {
    // internal states
    this._app = app;
    this._screen = null;
    this._curMaterail = null;
    this._curTexture = null;
    this._curSpriteBatch = null;
    this._curStencilLevel = 0;
    this._curUserKey = 0;
    this._dummyNode = new Node();

    // pools
    this._materialPool = new RecyclePool(() => {
      return new Material();
    }, 100);
    this._spriteBatchModelPool = new RecyclePool(() => {
      return new renderer.SpriteBatchModel();
    }, 100);
  }

  reset() {
    for (let i = 0; i < this._spriteBatchModelPool.length; ++i) {
      let spriteBatch = this._spriteBatchModelPool.data[i];
      spriteBatch.clear();
      this._app.scene.removeModel(spriteBatch);
    }

    this._materialPool.reset();
    this._spriteBatchModelPool.reset();
  }

  resetScreen(screen) {
    this._screen = screen;
    this._curMaterail = null;
    this._curTexture = null;
    this._curSpriteBatch = null;
    this._curStencilLevel = 0;
    this._curUserKey = 0;
  }

  _stencilWriteMask() {
    return 0x01 << (this._curStencilLevel - 1);
  }

  _stencilRef() {
    let result = 0;
    for (let i = 0; i < this._curStencilLevel; ++i) {
      result += (0x01 << i);
    }
    return result;
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

    let mat = this._cloneMaterial(material);
    mat.setProperty('mainTexture', texture);

    if (this._curStencilLevel !== 0) {
      let stencilRef = this._stencilRef();
      _setStencil(
        mat,
        gfx.DS_FUNC_EQUAL,
        stencilRef,
        stencilRef,
        gfx.STENCIL_OP_KEEP,
        gfx.STENCIL_OP_KEEP,
        gfx.STENCIL_OP_KEEP,
        0
      );
    }

    let spriteBatch = this._spriteBatchModelPool.add();
    spriteBatch.setNode(this._dummyNode);
    spriteBatch.setEffect(mat.effectInst);
    spriteBatch._viewID = this._screen._view._id;
    spriteBatch.setUserKey(this._curUserKey++);

    this._app.scene.addModel(spriteBatch);

    //
    this._curMaterail = material;
    this._curTexture = texture;
    this._curSpriteBatch = spriteBatch;

    return spriteBatch;
  }

  addImage(image) {
    let vdata = image.calcVertexData(
      image._rect.x,
      image._rect.y,
      image._rect.w,
      image._rect.h
    );

    let sprite = image.sprite;
    if (image.sprite === null) {
      sprite = this._app.assets.get('default-sprite');
    }

    let spriteBatch = this._getSpriteBatchModel(image.material, sprite.texture);
    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );
  }

  addText(text) {
    let vdata = text.calcVertexData(
      text._rect.x,
      text._rect.y,
      text._rect.w,
      text._rect.h
    );

    let fontTexture = (text.font === null) ? text.fontTexture : text.font.texture;
    let spriteBatch = this._getSpriteBatchModel(text.material, fontTexture);
    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );
  }

  pushMask (mask) {
    if (this._curStencilLevel + 1 > MAX_STENCIL_LEVEL) {
      console.error(`Stencil level exceeed, we only support ${MAX_STENCIL_LEVEL} level in this device.`);
      return;
    }
    this._curStencilLevel++;

    let vdata = mask.calcVertexData(
      mask._rect.x,
      mask._rect.y,
      mask._rect.w,
      mask._rect.h
    );

    // break batch
    this._curSpriteBatch = null;

    // setup mask material
    let sprite = mask.sprite;
    if (mask.sprite === null) {
      sprite = this._app.assets.get('default-sprite');
    }

    let mat = this._cloneMaterial(mask.material);
    mat.setProperty('mainTexture', sprite.texture);
    let stencilRef = this._stencilRef();
    let stencilWriteMask = this._stencilWriteMask();
    _setStencil(
      mat,
      gfx.DS_FUNC_NEVER,
      stencilRef,
      stencilWriteMask,
      gfx.STENCIL_OP_REPLACE,
      gfx.STENCIL_OP_KEEP,
      gfx.STENCIL_OP_KEEP,
      stencilWriteMask
    );

    // setup mask model
    let spriteBatch = this._spriteBatchModelPool.add();
    spriteBatch.setNode(this._dummyNode);
    spriteBatch.setEffect(mat.effectInst);
    spriteBatch._viewID = this._screen._view._id;
    spriteBatch.setUserKey(this._curUserKey++);

    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );

    this._app.scene.addModel(spriteBatch);
  }

  popMask (mask) {
    if (this._curStencilLevel - 1 < 0) {
      console.error('popMask being called more than once');
      return;
    }

    // break batch
    this._curSpriteBatch = null;

    let vdata = mask.calcVertexData(
      mask._rect.x,
      mask._rect.y,
      mask._rect.w,
      mask._rect.h
    );

    // setup mask material
    let sprite = mask.sprite;
    if (mask.sprite === null) {
      sprite = this._app.assets.get('default-sprite');
    }

    let mat = this._cloneMaterial(mask.material);
    mat.setProperty('mainTexture', sprite.texture);
    let stencilWriteMask = this._stencilWriteMask();
    _setStencil(
      mat,
      gfx.DS_FUNC_NEVER,
      0,
      stencilWriteMask,
      gfx.STENCIL_OP_REPLACE,
      gfx.STENCIL_OP_KEEP,
      gfx.STENCIL_OP_KEEP,
      stencilWriteMask
    );

    // setup mask model
    let spriteBatch = this._spriteBatchModelPool.add();
    spriteBatch.setNode(this._dummyNode);
    spriteBatch.setEffect(mat.effectInst);
    spriteBatch._viewID = this._screen._view._id;
    spriteBatch.setUserKey(this._curUserKey++);

    spriteBatch.addSprite(
      vdata.wposList,
      vdata.uvs,
      vdata.color,
      vdata.indices
    );

    this._app.scene.addModel(spriteBatch);

    this._curStencilLevel--;
  }
}
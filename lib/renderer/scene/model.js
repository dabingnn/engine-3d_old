// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
import { box } from '../../geom-utils';

/**
 * A representation of a model
 */
export default class Model {
  /**
   * Setup a default empty model
   */
  constructor() {
    this._type = 'default';
    this._poolID = -1;
    this._node = null;
    this._inputAssembler = null;
    this._effect = null;
    this._defines = {};
    this._dependencies = {};
    this._viewID = -1;
    this._cameraID = -1;
    this._userKey = -1;
    this._castShadow = false;

    // TODO: we calculate aabb based on vertices
    // this._aabb
    this._boundingBox = null;
  }

  /**
   * Set the hosting node of this model
   * @param {Node} node the hosting node
   */
  setNode(node) {
    this._node = node;
  }

  /**
   * Set the input assembler
   * @param {InputAssembler} ia
   */
  setInputAssembler(ia) {
    this._inputAssembler = ia;
  }

  /**
   * Set the model effect
   * @param {?Effect} effect the effect to use
   */
  setEffect(effect) {
    if (effect) {
      this._effect = effect;
      this._defines = effect.extractDefines(Object.create(null));
      this._dependencies = effect.extractDependencies(Object.create(null));
    } else {
      this._effect = null;
      this._defines = Object.create(null);
      this._dependencies = Object.create(null);
    }
  }

  /**
   * Set the user key
   * @param {number} key
   */
  setUserKey(key) {
    this._userKey = key;
  }

  /**
   * Extract a drawing item
   * @param {Object} out the receiving item
   */
  extractDrawItem(out) {
    out.model = this;
    out.node = this._node;
    out.ia = this._inputAssembler;
    out.effect = this._effect;
    out.defines = this._effect.extractDefines(this._defines);
    out.dependencies = this._effect.extractDependencies(this._dependencies);
  }

  /**
   * Create the bounding box of this model
   * @param {number} minPos the min position of the model
   * @param {number} maxPos the max position of the model
   */
  createBoundingBox(minPos, maxPos) {
    if (minPos === null || minPos === undefined || maxPos === null || maxPos === undefined) {
      // console.warn('can not create boundingBox for mesh without min,max position');
      return;
    }

    this._bbModelSpace = box.fromPoints(minPos, maxPos);
    this._boundingBox = box.clone(this._bbModelSpace);
  }
}
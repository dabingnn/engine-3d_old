import gfx from 'gfx.js';
import renderer from 'renderer.js';

export default {
  // blend type
  BLEND_NONE: 0,
  BLEND_NORMAL: 1,
  BLEND_CUSTOM: 2,

  // animation blend mode
  ANIM_BLEND: 0,
  ANIM_ADDITIVE: 1,

  // animation wrap mode
  ANIM_WRAP_ONCE: 0,
  ANIM_WRAP_LOOP: 1,
  ANIM_WRAP_PINGPONG: 2,
  ANIM_WRAP_CLAMP: 3,

  // anchor
  ANCHOR_CENTER: 0,
  ANCHOR_TOP_LEFT: 1,
  ANCHOR_TOP_RIGHT: 2,
  ANCHOR_MID_LEFT: 3,
  ANCHOR_MID_RIGHT: 4,
  ANCHOR_BOTTOM_LEFT: 5,
  ANCHOR_BOTTOM_RIGHT: 6,

  // sprite type
  SPRITE_SIMPLE: 0,
  SPRITE_SLICED: 1,

  // text alignment for horizontal and vertical
  TEXT_ALIGN_LEFT: 0,
  TEXT_ALIGN_CENTER: 1,
  TEXT_ALIGN_RIGHT: 2,
  TEXT_ALIGN_BOTTOM: 3,
  TEXT_ALIGN_TOP: 4,

  // projection type
  PROJ_PERSPECTIVE: renderer.PROJ_PERSPECTIVE,
  PROJ_ORTHO: renderer.PROJ_ORTHO,

  // clear flags
  CLEAR_COLOR: renderer.CLEAR_COLOR,
  CLEAR_DEPTH: renderer.CLEAR_DEPTH,
  CLEAR_STENCIL: renderer.CLEAR_STENCIL,
};
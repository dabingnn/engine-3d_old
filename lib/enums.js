import gfx from 'gfx.js';

export default {
  // blend type
  BLEND_NONE: 0,
  BLEND_NORMAL: 1,

  // wrap mode
  WRAP_REPEAT: gfx.WRAP_REPEAT,
  WRAP_CLAMP: gfx.WRAP_CLAMP,
  WRAP_MIRROR: gfx.WRAP_MIRROR,

  // filter mode
  FILTER_NEAREST: gfx.FILTER_NEAREST,
  FILTER_LINEAR: gfx.FILTER_LINEAR,

  // animation blend mode
  ANIM_BLEND: 0,
  ANIM_ADDITIVE: 1,

  // animation wrap mode
  ANIM_WRAP_ONCE: 0,
  ANIM_WRAP_LOOP: 1,
  ANIM_WRAP_PINGPONG: 2,
  ANIM_WRAP_CLAMP: 3,

  // sprite type
  SPRITE_SIMPLE: 0,
  SPRITE_SLICED: 1,
};
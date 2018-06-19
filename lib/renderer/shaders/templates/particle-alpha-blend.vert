// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position; // center position
attribute vec3 a_uv;  // xy:vertex index,z:frame index
attribute vec2 a_uv0; // size, angle
attribute vec4 a_color;
#if USE_STRETCHED_BILLBOARD
attribute vec4 a_color0; // velocity.x, velocity.y, velocity.z, scale
#endif

uniform vec2 frameTile;
uniform vec2 mainTiling;
uniform vec2 mainOffset;
uniform mat4 model;
uniform mat4 viewProj;

#if USE_BILLBOARD || USE_VERTICAL_BILLBOARD
  uniform mat4 view;
#endif

#if USE_STRETCHED_BILLBOARD
  uniform vec3 eye;
#endif

varying vec2 uv;
varying vec4 color;

void main () {
  vec4 pos = vec4(a_position, 1);
#if USE_STRETCHED_BILLBOARD
  vec4 velocity = vec4(a_color0.xyz,0);
#endif

#if USE_WORLD_SPACE
  // simulate in world space. apply model matrix on CPU side.
#else
  pos = model * pos;
  #if USE_STRETCHED_BILLBOARD
  velocity = model * velocity;
  #endif
#endif

  vec2 cornerOffset = vec2((a_uv.x - 0.5) * a_uv0.x, (a_uv.y - 0.5) * a_uv0.x); 
#if USE_STRETCHED_BILLBOARD
  // rotation will not be applied in stretchedBillboard mode(Unity).
#else
  // rotation
  vec2 rotatedOffset;
  rotatedOffset.x = cos(a_uv0.y) * cornerOffset.x - sin(a_uv0.y) * cornerOffset.y;
  rotatedOffset.y = sin(a_uv0.y) * cornerOffset.x + cos(a_uv0.y) * cornerOffset.y;
#endif

#if USE_BILLBOARD
  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));
  vec3 camUp = normalize(vec3(view[0][1], view[1][1], view[2][1]));
  pos.xyz += (camRight * rotatedOffset.x) + (camUp * rotatedOffset.y);
#elif USE_STRETCHED_BILLBOARD
  vec3 camRight = normalize(cross(pos.xyz - eye, velocity.xyz));
  vec3 camUp = normalize(velocity.xyz);
  pos.xyz += (camRight * cornerOffset.x) + camUp * (a_color0.w / 2.0 * sign(cornerOffset.y)); 
#elif USE_HORIZONTAL_BILLBOARD
  vec3 camRight = vec3(1, 0, 0);
  vec3 camUp = vec3(0, 0, -1);
  pos.xyz += (camRight * rotatedOffset.x) + (camUp * rotatedOffset.y);
#elif USE_VERTICAL_BILLBOARD
  vec3 camRight = normalize(vec3(view[0][0], view[1][0], view[2][0]));
  vec3 camUp = vec3(0, 1, 0);
  pos.xyz += (camRight * rotatedOffset.x) + (camUp * rotatedOffset.y);
#else
  pos.x += rotatedOffset.x;
  pos.y += rotatedOffset.y;
#endif

  pos = viewProj * pos;

  vec2 aniUV = vec2(0, floor(a_uv.z * frameTile.y));
  aniUV.x = floor(a_uv.z * frameTile.x * frameTile.y - aniUV.y * frameTile.x);
  aniUV.y = frameTile.y - aniUV.y - 1.0;
  aniUV = (aniUV.xy + a_uv.xy) / vec2(frameTile.x, frameTile.y);
  uv = aniUV * mainTiling + mainOffset;

  color = a_color;

  gl_Position = pos;
}
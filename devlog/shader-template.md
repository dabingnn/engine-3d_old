# 关于 Shader Template 的使用说明

## 支持的 Preprocessor Directives

`#define`, `#undef`, `#if`, `#ifdef`, `#ifndef`, `#else`, `#elif`, `#endif`, `#error`,
`#pragma`, `extension`, `#version`, `#line`, `defined`...

具体可参考 GLSLangSpec ：<https://www.khronos.org/registry/OpenGL/specs/gl/GLSLangSpec.1.20.pdf>

此外还支持 `#include`, 但是目前只支持 templates 引用 chunks 里的 shader, 不支持嵌套引用。

## for 循环展开

像下面这样展开：
```glsl
#if NUM_POINT_LIGHTS > 0
  #pragma for id in range(0, NUM_POINT_LIGHTS)
    uniform vec3 point_light{id}_position;
    uniform vec3 point_light{id}_color;
    uniform float point_light{id}_range;
  #pragma endFor
#endif
```
注意关键字之间的空格，'for' 与 'in' 之间的 index 关键字可以自由设定， 但必须是长度大于 1 的字符，
在 for 循环内部引用时要用 {} 括起来。range() 里必须填入两个 int 来表示循环开始和结束。
附：展开时用到的 RegExp :
`/#pragma for (\w+) in range\(\s*(\d+)\s*,\s*(\d+)\s*\)([\s\S]+?)#pragma endFor/g`

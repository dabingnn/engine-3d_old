// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

varying vec3 viewDir;

uniform samplerCube cubeMap;

void main() {
    gl_FragColor = textureCube(cubeMap, viewDir);
}
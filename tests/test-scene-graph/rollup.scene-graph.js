'use strict';

const fsJetpack = require('fs-jetpack');
const pjson = require('../../package.json');
const resolve = require('@gamedev-js/rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');

console.log('rollup the code...');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @cocos
 * Released under the MIT License.
 */
`;

let dest = './tests/test-scene-graph/dist';
let file = 'scene-graph';
let name = 'sceneGraph';
let sourcemap = true;
let globals = {};

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  input: './lib/scene-graph/index.js',
  external: [],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      root: process.cwd()
    }),
    commonjs(),
    buble()
  ],
  output: [
    {
      file: `${dest}/${file}.dev.js`,
      format: 'iife',
      name,
      banner,
      globals,
      sourcemap,
    },
    {
      file: `${dest}/${file}.js`,
      format: 'cjs',
      name,
      banner,
      globals,
      sourcemap,
    }
  ],
};

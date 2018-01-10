'use strict';

const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');
const resolve = require('@gamedev-js/rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');

console.log('rollup the code...');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @Johnny Wu
 * Released under the MIT License.
 */
`;

let dest = './dist';
let file = 'engine';
let moduleName = 'cc';

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  entry: './index.js',
  targets: [
    { dest: `${dest}/${file}.dev.js`, format: 'iife' },
    { dest: `${dest}/${file}.js`, format: 'cjs' },
  ],
  moduleName,
  banner,
  external: [],
  globals: {},
  sourceMap: true,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      root: process.cwd()
    }),
    commonjs(),
    buble()
  ],
};

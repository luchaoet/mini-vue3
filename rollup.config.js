import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  }
}

const defaultFormats = ['esm-bundler', 'cjs'];
const packageFormats = packageOptions.formats || defaultFormats;
const packageConfigs = packageFormats.map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs;

function createConfig(format, output) {
  output.name = packageOptions.name
  output.sourcemap = true
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      json(),
      ts({ tsconfig: path.resolve(__dirname, 'tsconfig.json') }),
      nodeResolve()
    ]
  }
}
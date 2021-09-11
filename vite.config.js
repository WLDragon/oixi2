import buble from '@rollup/plugin-buble'
import path from 'path'
import pkg from './package.json'

const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC')
const banner = `/*!
 * ${pkg.name} - v${pkg.version}
 * Compiled ${compiled}
 * 
 * ${pkg.name} is licensed under the MIT License.
 * 
 * Copyright 2021, ${pkg.author.name}<${pkg.author.email}>, All Rights Reserved
 */`

export default {
  base: './',
  server: {
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    terserOptions: {
      format: {
        webkit: true //处理safari的bug
      }
    },
    // minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'oixi',
      fileName: (format) => `oixi.${format}.min.js`
    },
    rollupOptions: {
      external: ['pixi.js'],
      output: {
        banner,
        dir: 'dist',
        sourcemap: true,
        globals: {
          'pixi.js': 'PIXI'
        }
      },
      plugins: [
        buble()
      ]
    }
  }
}
import buble from '@rollup/plugin-buble'

export default {
  root: 'demo',
  base: './',
  build: {
    outDir: '../dist',
    assetsDir: 'js',
    emptyOutDir: true,
    terserOptions: {
      format: {
        webkit: true //处理safari的bug
      }
    },
    rollupOptions: {
      external: ['pixi.js'],
      output: {
        dir: 'dist',
        format: 'iife',
        globals: {
          'pixi.js': 'PIXI'
        }
      },
      plugins: [
        buble({ exclude: ['*/index.html', '*/pixi.min.js'] }) //去掉'=>'等es6代码
      ]
    }
  }
}
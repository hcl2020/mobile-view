const fs = require('fs');
const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript');

const input = path.resolve(__dirname, '../src/index.ts');
const version = process.env.VERSION || require('../package.json').version;
const getCssContent = () =>
  fs.readFileSync(path.resolve(__dirname, '../src/index.css')).toString().replace(/\n|\r/g, '').replace(/  /g, ' ');

const banner =
  '/*!\n' +
  ` * MobileView(m-preview) v${version}\n` +
  ` * (c) 2017-${new Date().getFullYear()} HeChanglin\n` +
  ' * Released under the MIT License.\n' +
  ' */';

const builds = {
  // CommonJS build (CommonJS)
  cjs: {
    file: '.common.js',
    format: 'cjs',
    env: 'development'
  },
  // ES modules build (for bundlers)
  esm: {
    file: '.esm.js',
    format: 'es'
  },
  // ES modules build (for direct import in browser)
  'esm-browser': {
    file: '.esm.browser.js',
    format: 'es',
    transpile: false,
    env: 'development'
  },
  // development build (Browser)
  umd: {
    file: '.js',
    format: 'umd',
    env: 'development'
  },

  'cjs-prod': {
    file: '.common.min.js',
    format: 'cjs',
    env: 'production'
  },
  // ES modules build (for bundlers)
  'esm-prod': {
    file: '.esm.min.js',
    format: 'es'
  },
  // ES modules build (for direct import in browser)
  'esm-browser-prod': {
    file: '.esm.browser.min.js',
    format: 'es',
    transpile: false,
    env: 'production'
  },
  // production build  (Browser)
  'umd-prod': {
    file: '.min.js',
    format: 'umd',
    env: 'production'
  }
};

function genConfig(name) {
  const opts = builds[name];
  const { plugins = [], format } = opts;

  plugins.push(
    typescript(),
    replace({
      'process.env.NODE_ENV': opts.env && JSON.stringify(opts.env),
      __VERSION__: `v${version}`
    }),

    {
      name: 'loadCss',
      transform(code, id) {
        code = code.replace('__CSS_CONTENT__', getCssContent());
        return { code };
      }
    }
  );

  if (opts.transpile !== false) {
    plugins.push(buble());
  }

  plugins.push(
    resolve({
      // browser: true
    }),
    commonjs()
  );

  const file = path.resolve(__dirname, '../dist/', 'mobile-view' + opts.file);
  const config = {
    input,
    plugins,
    output: { file, format, banner, name: 'MobileView' },
    watch: { include: ['src/**'] },
    onwarn(msg, warn) {
      warn(msg);
    }
  };
  Object.defineProperty(config, '_name', { enumerable: false, value: name });

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}

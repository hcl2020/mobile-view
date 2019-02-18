const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript');

const version = process.env.VERSION || require('../package.json').version;

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

const input = path.resolve(__dirname, '../src/index.js');

function genConfig(name) {
  const opts = builds[name];
  const { plugins = [], file, format } = opts;
  const config = {
    input,
    plugins,
    output: {
      file: path.resolve(__dirname, '../dist/', 'mobile-view' + file),
      format,
      banner,
      name: 'MobileView'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg);
      }
    }
  };

  config.plugins.push(typescript());

  // built-in vars
  const vars = {
    __VERSION__: version
  };
  // build-specific env
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env);
  }
  config.plugins.push(replace(vars));

  if (opts.transpile !== false) {
    config.plugins.push(buble());
  }
  config.plugins.push(
    resolve({
      // browser: true
    }),
    commonjs()
  );
  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  });

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}

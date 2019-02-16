module.exports = {
  files: ['dist/*.css', 'dist/*.js', 'example/**/*.html'],
  server: {
    // directory: true,
    baseDir: 'example',
    index: 'index.html',
    routes: {
      '/dist': 'dist'
    }
  },
  online: false,
  open: false
};

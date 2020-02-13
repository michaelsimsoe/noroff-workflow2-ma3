const { dest, src, series, parallel, watch } = require('gulp');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
var browserSync = require('browser-sync').create();

var path = require('path');

function html(cb) {
  src('src/**/*.html').pipe(dest('build/'));
  cb();
}

function lessTask(cb) {
  src('src/less/**/*.less')
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'includes')]
      })
    )
    .pipe(dest('build/css'));
  cb();
}

function imageMin(cb) {
  src('src/images/*')
    .pipe(imagemin())
    .pipe(dest('build/images'));
  cb();
}

function watcher(cb) {
  watch('src/less/**/*.less').on(
    'change',
    series(lessTask, browserSync.reload)
  );
  watch('src/**/*.html').on('change', series(html, browserSync.reload));
  cb();
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: 'build'
    }
  });
  cb();
}

exports.default = series(parallel(html, lessTask, imageMin), server, watcher);

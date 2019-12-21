var gulp = require('gulp');
var less = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var browserSync = require('browser-sync');

var paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  },
};
 
/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'assets' ]);
}
 
/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}
 
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}
 
function htmls() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.html.src, htmls);
}
 
/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(clean, styles, scripts, htmls, images));

function develop() {
  build();
  browserSync({
    server: {
      baseDir: 'dist',
    },
   port: 8080
  });
  gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
  gulp.watch(paths.styles.src, styles).on('change', browserSync.reload);
  gulp.watch(paths.html.src, htmls).on('change', browserSync.reload);
  gulp.watch(paths.images.src, images).on('change', browserSync.reload);
}
 
/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.develop = develop;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;
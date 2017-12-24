'use strict';

const del = require('del');
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const sequence = require('run-sequence');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const CDN = require('./cdn.json');
const DEST = 'dist/';

gulp.task('clear', () => {
  return del(DEST);
});

gulp.task('webpack', function () {
  return gulp.src('dist/*.js')
    .pipe(webpackStream(require('./webpack.config.prod'), webpack))
    .pipe(gulp.dest(DEST + 'js/'));
});

gulp.task('stylus', () => {
  return gulp.src('styl/screen.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest(DEST + 'css/'));
});

gulp.task('html', () => {
  return gulp.src('index.dev.html')
    .pipe(rename('index.html'))
    .pipe(replace(/node_modules\/([\w-.]+)\/(dist\/)?/g, (match, repo) => {
      return CDN[repo];
    }))
    .pipe(replace('dist/', 'js/'))
    .pipe(replace('static/css/', 'css/'))
    .pipe(gulp.dest(DEST));
});

gulp.task('copy', () => {
  return gulp.src('static/css/base.css')
    .pipe(gulp.dest(DEST + 'css/'));
});

gulp.task('default', callback => {
  sequence(
    'clear',
    ['stylus', 'webpack', 'html', 'copy'],
    callback
  );
});

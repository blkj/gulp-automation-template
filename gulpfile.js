var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();

var G = {
    path: '.',
    page: ['./page/**/*.html', '!./page/include/*.html'],
    html: ['./*.html', './module/**/*.html'],
    sass: './static/sass/*.scss',
    css: './static/**/*.css',
    js: './static/**/*.js'
};

gulp.task('server', function(){
    browserSync.init({
        server: G.path
    });
});

gulp.task('compass', function(){
    gulp.src(G.sass)
        // 使用 plumber 可以在纠正错误后继续执行任务
		.pipe(plumber())
		.pipe(compass({
			config_file: './config.rb',
			css: 'static/css',
			sass: 'static/sass'
		}));
});

// css 文件变动后自动注入到页面，刷新样式
gulp.task('css', function(){
    gulp.src(G.css)
        .pipe(browserSync.stream());
});

// 适配 page 中所有文件夹下的所有 html ，排除 page 下的 include 文件夹中 html
gulp.task('page', function(){
    gulp.src(G.page)
        .pipe(plumber())
        .pipe(fileinclude())
        .pipe(gulp.dest(G.path));
});

gulp.task('default', ['server'], function(cb){
	gulp.watch(G.sass, ['compass']);
	gulp.watch(G.css, ['css']);
    gulp.watch([G.page[0], G.js], ['page']);
    gulp.watch([G.html, G.js]).on('change', browserSync.reload);
});
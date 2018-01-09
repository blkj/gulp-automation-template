var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();

var G = {
    path: '.',
    page: [
        './page/**/*.html',
        '!./page/include/*.html'
    ],
    html: [
        './*.html',
        './module/**/*.html'
    ],
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
    return gulp.src(G.sass)
        // 使用 plumber 可以在纠正错误后继续执行任务
		.pipe($.plumber())
		.pipe($.compass({
			config_file: './config.rb',
			css: 'static/css',
			sass: 'static/sass'
		}));
});

// css 文件变动后自动注入到页面，刷新样式
gulp.task('css', function(){
    return gulp.src(G.css)
        .pipe(browserSync.stream());
});

// 适配 page 中所有文件夹下的所有 html ，排除 page 下的 include 文件夹中 html
gulp.task('page', function(){
    return gulp.src(G.page)
        .pipe($.plumber())
        .pipe($.fileInclude())
        .pipe(gulp.dest(G.path));
});

gulp.task('default', ['server'], function(){
	gulp.watch(G.sass, ['compass']);
	gulp.watch(G.css, ['css']);
    gulp.watch(G.page, ['page']);
    gulp.watch([G.html, G.js]).on('change', browserSync.reload);
});

// 打包
gulp.task('build', function(){
    runSequence('del', 'compass', 'page', 'imagemin', 'compressCss', 'revCss', 'compressJs', 'revJs', 'delRev', 'copyOtherFile');
});

gulp.task('del', function(){
    return del.sync(['build/**']);
});

gulp.task('imagemin', function(){
    gulp.src('./static/image/*.{png,jpg,gif,ico}')
        .pipe($.imagemin({
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('./build/static/image'));
});

// 压缩 css 文件
gulp.task('compressCss', function(){
    return gulp.src('./static/css/*.css')
        .pipe($.cleanCss())
        .pipe($.rev())
        .pipe(gulp.dest('./build/static/css'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./build/static/rev-css'));
});
gulp.task('revCss', function(){
    var a = gulp.src(['./build/static/rev-css/*.json', './*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build'));
    var b = gulp.src(['./build/static/rev-css/*.json', './module/**/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build'));
    return mergeStream(a, b);
});

// 压缩 js 文件
gulp.task('compressJs', function(){
    return gulp.src('./static/js/*.js')
        .pipe($.uglify())
        .pipe($.rev())
        .pipe(gulp.dest('./build/static/js'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./build/static/rev-js'));
});
gulp.task('revJs', function(){
    var a = gulp.src(['./build/static/rev-js/*.json', './build/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build'));
    var b = gulp.src(['./build/static/rev-js/*.json', './build/module/**/*.html'])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build'));
    return mergeStream(a, b);
});

gulp.task('delRev', function(){
    return del.sync(['./build/static/rev-css', './build/static/rev-js']);
});

gulp.task('copyOtherFile', function(){
    return gulp.src('./static/plugins/**/*')
        .pipe(gulp.dest('./build/static/plugins'));
});
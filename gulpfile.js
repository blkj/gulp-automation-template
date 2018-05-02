var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');
var browserSync = require('browser-sync').create();
var $ = require('gulp-load-plugins')();
var args = require('yargs').argv;
var pkg = require('./package.json');

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
    sourcejs: './static/sourcejs/*.js',
    js: [
        './static/**/*.js',
        '!./static/sourcejs/*.js'
    ]
};

var config = {};

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

gulp.task('js', function(event){
    return gulp.src(G.sourcejs)
        .pipe($.plumber())
        .pipe($.preprocess({
            context: config
        }))
        .pipe(gulp.dest('./static/js/'));
});

// 适配 page 中所有文件夹下的所有 html ，排除 page 下的 include 文件夹中 html
gulp.task('page', function(){
    return gulp.src(G.page)
        .pipe($.plumber())
        .pipe($.preprocess({
            context: config
        }))
        .pipe($.fileInclude())
        .pipe(gulp.dest(G.path));
});

gulp.task('config', function(){
    if(args.b){
        config.isLocal = false;
    }else{
        config.isLocal = true;
    }
});

gulp.task('default', function(){
    // 启动时先进行一次编译
    runSequence('config', 'compass', 'css', 'js', 'page', 'server');
    // 针对不同文件的监听
    $.watch(G.sass, function(e, type){
        gulp.watch(G.sass, ['compass']);
    });
    $.watch(G.css, function(){
        gulp.watch(G.css, ['css']);
    });
    $.watch(G.sourcejs, function(){
        gulp.watch(G.sourcejs, ['js']);
    });
    $.watch(G.js, function(){
        browserSync.reload();
    });
    $.watch(G.page[0], function(){
        gulp.watch(G.page[0], ['page']);
    });
    gulp.watch(G.html).on('change', browserSync.reload);
});

// 发布&打包
gulp.task('build', function(){
    if(args.z){
        runSequence('config', 'del', 'compass', 'js', 'page', 'tinypngNokey', 'compressCss', 'revCss', 'compressJs', 'revJs', 'delRev', 'htmlmin', 'copyOtherFile', 'zip');
    }else{
        runSequence('config', 'del', 'compass', 'js', 'page', 'tinypngNokey', 'compressCss', 'revCss', 'compressJs', 'revJs', 'delRev', 'htmlmin', 'copyOtherFile');
    }
});

gulp.task('del', function(){
    return del.sync(['build/**']);
});

gulp.task('tinypngNokey', function(){
    return gulp.src(['./static/image/**/*.{png,jpg,gif}', '!./static/image/sprite/*/*.{png,jpg,gif}'])
        .pipe($.tinypngNokey())
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
        .pipe(gulp.dest('./build/module'));
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
        .pipe(gulp.dest('./build/module'));
    return mergeStream(a, b);
});

gulp.task('delRev', function(){
    return del.sync(['./build/static/rev-css', './build/static/rev-js']);
});

// 压缩 html 文件
gulp.task('htmlmin', function(){
    var option = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    var a = gulp.src('./build/*.html')
        .pipe($.htmlmin(option))
        .pipe(gulp.dest('./build'));
    var b = gulp.src('./build/module/**/*.html')
        .pipe($.htmlmin(option))
        .pipe(gulp.dest('./build/module'));
    return mergeStream(a, b);
});

// 拷贝其它文件到 build 里
gulp.task('copyOtherFile', function(){
    var plugins = gulp.src('./static/plugin/**/*')
        .pipe(gulp.dest('./build/static/plugin'));
    var template = gulp.src('./static/template/*')
        .pipe(gulp.dest('./build/static/template'));
    return mergeStream(plugins, template);
});

gulp.task('zip', function(){
    return gulp.src('./build/**/*')
        .pipe($.zip(pkg.name + '.' + getNowFormatDate() + '.zip'))
        .pipe(gulp.dest('./build-zip'));
});

// 获取当前时间
function getNowFormatDate(){
    var date = new Date();
    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + month + strDate + '.' + hour + minute + second;
}
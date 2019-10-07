var gulp = require('gulp')
var fs = require('fs')
var del = require('del')
var mergeStream = require('merge-stream')
var browserSync = require('browser-sync').create()
var $ = require('gulp-load-plugins')()
var inquirer = require('inquirer')
var pkg = require('./package.json')
var config = require('./config.json')

var G = {
    path: '.',
    page: ['./page/**/*.html', '!./page/include/*.html'],
    html: ['./*.html', './module/**/*.html'],
    sass: './static/sass/**/*.scss',
    css: './static/**/*.css',
    sourcejs: './static/sourcejs/**/*.js',
    js: ['./static/**/*.js', '!./static/sourcejs/*.js']
}

var answersData = {}

// 默认任务
gulp.task(
    'default',
    gulp.series(inquire, gulp.parallel(sprites, sass, js, page), server, watchs)
)

// 发布&打包
gulp.task(
    'build',
    gulp.series(
        inquireBuild,
        delBuildFile,
        gulp.parallel(sprites, sass, js, page),
        gulp.parallel(compressCss, compressJs),
        revCssAndJs,
        delRev,
        htmlmin,
        copyOtherFile,
        compressImage,
        zip
    )
)

function inquire(done) {
    var choices = []
    for (var i in config) {
        choices.push(config[i].name)
    }
    inquirer
        .prompt([
            {
                type: 'list',
                message: '请选择运行环境：',
                name: 'env',
                choices: choices,
                filter: val => {
                    var key = ''
                    for (var i in config) {
                        if (config[i].name == val) {
                            key = i
                            break
                        }
                    }
                    return key
                }
            }
        ])
        .then(answers => {
            answersData = answers
            done()
        })
}

function inquireBuild(done) {
    var choices = []
    for (var i in config) {
        choices.push(config[i].name)
    }
    inquirer
        .prompt([
            {
                type: 'list',
                message: '请选择打包环境：',
                name: 'env',
                choices: choices,
                filter: val => {
                    var key = ''
                    for (var i in config) {
                        if (config[i].name == val) {
                            key = i
                            break
                        }
                    }
                    return key
                }
            },
            {
                type: 'confirm',
                message: '是否压缩图片：',
                name: 'compressImage'
            },
            {
                type: 'list',
                message: '请选择图片压缩方式：',
                name: 'compressImageType',
                choices: ['imagemin', 'tinypng'],
                when: answers => {
                    return answers.compressImage
                }
            },
            {
                type: 'confirm',
                message: '是否生成压缩包：',
                name: 'zip',
                default: false
            },
            {
                type: 'input',
                message: '请输入压缩包名称：',
                name: 'zipName',
                default: pkg.name,
                when: answers => {
                    return answers.zip
                }
            }
        ])
        .then(answers => {
            answersData = answers
            done()
        })
}

function server(done) {
    browserSync.init({
        server: G.path
    })
    done()
}

function sprites(done) {
    var arr = []
    var folder = []
    fs.readdirSync('static/image/sprite/').map(item => {
        var stat = fs.statSync(`static/image/sprite/${item}`)
        if (stat.isDirectory()) {
            folder.push(item)
        }
    })
    if (folder.length) {
        folder.map(item => {
            arr.push(
                gulp
                    .src(`static/image/sprite/${item}/*.png`)
                    .pipe($.plumber())
                    .pipe(
                        $.spritesmith({
                            imgName: `${item}.png`,
                            cssName: `_${item}.scss`,
                            imgPath: `../image/sprite/${item}.png`,
                            cssTemplate: 'scss.template.handlebars',
                            cssSpritesheetName: `${item}`
                        })
                    )
                    .pipe(gulp.dest('static/image/sprite/'))
            )
        })
        return mergeStream(...arr)
    } else {
        done()
    }
}

function sass() {
    return gulp
        .src(G.sass)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./static/css/'))
}

// css 文件变动后自动注入到页面，刷新样式
function css() {
    return gulp.src(G.css).pipe(browserSync.stream())
}

function js() {
    return gulp
        .src(G.sourcejs)
        .pipe($.plumber())
        .pipe(
            $.preprocess({
                context: config[answersData.env].data
            })
        )
        .pipe(gulp.dest('./static/js/'))
}

// 适配 page 中所有文件夹下的所有 html ，排除 page 下的 include 文件夹中 html
function page() {
    return gulp
        .src(G.page)
        .pipe($.plumber())
        .pipe(
            $.preprocess({
                context: config[answersData.env].data
            })
        )
        .pipe($.fileInclude())
        .pipe(gulp.dest(G.path))
}

// 针对不同文件进行监听
function watchs(done) {
    gulp.watch('static/image/sprite/*/*.png', gulp.series(sprites))
    gulp.watch(G.sass, gulp.series(sass))
    gulp.watch(G.css, gulp.series(css))
    gulp.watch(G.sourcejs, gulp.series(js))
    gulp.watch(G.js).on('change', browserSync.reload)
    gulp.watch(G.page[0], gulp.series(page))
    gulp.watch(G.html).on('change', browserSync.reload)
    done()
}

function delBuildFile(done) {
    del.sync(['build/**'])
    done()
}

function compressImage() {
    var image = gulp.src([
        './static/image/**/*.{png,jpg,gif}',
        '!./static/image/sprite/*/*.{png,jpg,gif}'
    ])
    if (answersData.compressImage) {
        if (answersData.compressImageType == 'imagemin') {
            image.pipe(
                $.imagemin({
                    progressive: true,
                    optimizationLevel: 7
                })
            )
        } else {
            image.pipe($.tinypngNokey())
        }
        image.pipe(gulp.dest('./build/static/image'))
    }
    return image
}

// 压缩 css 文件
function compressCss() {
    return gulp
        .src('./static/css/**/*.css')
        .pipe($.cleanCss())
        .pipe($.rev())
        .pipe(gulp.dest('./build/static/css'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./build/static/rev-css'))
}

// 压缩 js 文件
function compressJs() {
    return gulp
        .src('./static/js/**/*.js')
        .pipe($.uglify())
        .pipe($.rev())
        .pipe(gulp.dest('./build/static/js'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./build/static/rev-js'))
}

function revCssAndJs() {
    var a = gulp
        .src([
            './build/static/rev-css/*.json',
            './build/static/rev-js/*.json',
            './*.html'
        ])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build'))
    var b = gulp
        .src([
            './build/static/rev-css/*.json',
            './build/static/rev-js/*.json',
            './module/**/*.html'
        ])
        .pipe($.revCollector())
        .pipe(gulp.dest('./build/module'))
    return mergeStream(a, b)
}

function delRev(done) {
    del.sync(['./build/static/rev-css', './build/static/rev-js'])
    done()
}

// 压缩 html 文件
function htmlmin() {
    var option = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    }
    var a = gulp
        .src('./build/*.html')
        .pipe($.htmlmin(option))
        .pipe(gulp.dest('./build'))
    var b = gulp
        .src('./build/module/**/*.html')
        .pipe($.htmlmin(option))
        .pipe(gulp.dest('./build/module'))
    return mergeStream(a, b)
}

// 拷贝其它文件到 build 里
function copyOtherFile() {
    var plugins = gulp
        .src('./static/plugin/**/*')
        .pipe(gulp.dest('./build/static/plugin'))
    var template = gulp
        .src('./static/template/*')
        .pipe(gulp.dest('./build/static/template'))
    return mergeStream(plugins, template)
}

function zip() {
    var zip = gulp.src('./build/**/*')
    if (answersData.zip) {
        zip.pipe(
            $.zip(answersData.zipName + '.' + getNowFormatDate() + '.zip')
        ).pipe(gulp.dest('./build-zip'))
    }
    return zip
}

// 获取当前时间
function getNowFormatDate() {
    var date = new Date()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var second =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return date.getFullYear() + month + strDate + '.' + hour + minute + second
}

# gulp-automation

利用 Gulp 配置的前端项目自动化工作流，实现 css js html 代码和图片一键压缩、发布、打包、上线。

---

## 用法

### 安装

```
$ npm install
```

### 运行

```
$ gulp
```

访问 `http://localhost:3000` 即可看到页面。

### 发布

```
$ gulp build
```

每次发布前会先删除 build 目录后再新建，有时候会报错，建议重复执行该命令。

如果发布同时需要打包，则执行以下命令：

```
$ gulp build --z
```

## 说明

### 目录结构

```
gulp-automation
　├ build              发布目录，发布时会将 css js html 文件进行压缩，并存放于此
　├ build-zip          打包目录，每次发布都会生成一个 zip 压缩包存放于此
　├ page               静态页面
　│　└ include         公用页面
　├ static             资源文件
　│　├ css             css 文件，通过 sass 自动生成
　│　├ image           图片文件
　│　├ js              js 文件
　│　├ plugins         plugins 文件，存放 js 或 css 的插件和框架
　│　├ sass            sass 源文件
　│　└ template        template 文件，存放 js 模版文件
　├ config.rb          compass 配置文件
　├ gulpfile.js        gulp 配置文件
　└ package.json       npm 配置文件
```

### 功能模块

- [browser-sync](https://browsersync.io/) ([中文网](http://www.browsersync.cn/))
- [del](https://www.npmjs.com/package/del)
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- [gulp-compass](https://www.npmjs.com/package/gulp-compass)
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include)
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
- [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins)
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)
- [gulp-rev](https://www.npmjs.com/package/gulp-rev)
- [gulp-rev-collector](https://www.npmjs.com/package/gulp-rev-collector)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [gulp-zip](https://www.npmjs.com/package/gulp-zip)
- [merge-stream](https://www.npmjs.com/package/merge-stream)
- [run-sequence](https://www.npmjs.com/package/run-sequence)
- [yargs](https://www.npmjs.com/package/yargs)
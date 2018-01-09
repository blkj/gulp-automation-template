# gulp-automation

利用 Gulp 配置的前端项目自动化工作流

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

### 打包

```
$ gulp build
```

每次打包会先删除 build 目录后再新建，有时候会报错，建议重复执行该命令。

## 说明

### 目录结构

```
gulp-automation
　├ page               静态页面
　│　└ include         公用页面
　├ static             资源文件
　│　├ css             css 文件，通过 sass 自动生成
　│　├ image           图片文件
　│　├ js              js 文件
　│　├ plugins         plugins 文件，存放 js 或 css 的插件和框架
　│　└ sass            sass 源文件
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
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
- [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins)
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)
- [gulp-rev](https://www.npmjs.com/package/gulp-rev)
- [gulp-rev-collector](https://www.npmjs.com/package/gulp-rev-collector)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [merge-stream](https://www.npmjs.com/package/merge-stream)
- [run-sequence](https://www.npmjs.com/package/run-sequence)
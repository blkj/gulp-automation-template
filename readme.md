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
　│　└ sass            sass 源文件
　├ config.rb          compass 配置文件
　├ gulpfile.js        gulp 配置文件
　└ package.json       npm 配置文件
```

### 功能模块

- [browser-sync](https://browsersync.io/) ([中文网](http://www.browsersync.cn/))
- [gulp-compass](https://www.npmjs.com/package/gulp-compass)
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include)
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber)


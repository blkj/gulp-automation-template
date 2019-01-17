# gulp-automation

利用 Gulp 配置的前端项目自动化工作流，实现 css js html 代码和图片一键压缩、发布、打包、上线。

---

## 使用

> 本项目基于 Gulp 4.x 运行，如果你以前全局安装过 gulp ，需要先运行 `npm rm --global gulp` 删除旧版本 gulp ，再运行 `npm install --global gulp-cli` 安装最新版本。

下载到本地后运行：

```
$ npm install
$ gulp
```

访问 `http://localhost:3000` 即可看到页面。

## 参数

### gulp

运行指令

```
$ gulp [options]
```

- `--local` ，用于切换本地/生成环境，默认为 `true` ，需要在代码里配置，具体可参考 `page/module/example/` 目录下演示文件
- `--l` ，同 `--local`

示例：

```
gulp --l false
```

### gulp build

发布指令

> 发布时使用了 gulp-tinypng-nokey 包进行图片压缩，需要将图片上传到服务器压缩后再下载，请确保打包时网络畅通

```
$ gulp build [options]
```

- `--local` ，切换至本地环境
- `--l` ，同 `--local`
- `--noimg` ，不处理图片
- `--zip` ，创建压缩包，压缩包文件名为 package.json 里的 name 参数

示例：

```
gulp build --noimg --zip
```

## 说明

### 目录结构

```
gulp-automation
  ├─ build                发布目录，发布时会将 css js html 文件进行压缩，并存放于此
  ├─ build-zip            打包目录，每次发布都会生成一个 zip 压缩包存放于此
  ├─ page                 静态页面
  │  └─ include           公用页面
  ├─ static               资源文件
  │  ├─ css               css 文件，通过 sass 自动生成
  │  ├─ image             图片文件
  │  │  └─ sprite         精灵图存放目录
  │  ├─ js                js 文件，通过 sourcejs 自动生成
  │  ├─ plugin            plugin 文件，存放 js 或 css 的插件和框架
  │  ├─ sass              sass 源文件
  │  ├─ sourcejs          js 源文件
  │  └─ template          template 文件，存放 js 模版文件
  ├─ config.rb            compass 配置文件
  ├─ gulpfile.js          gulp 配置文件
  └─ package.json         npm 配置文件
```

### 功能模块

- [browser-sync](https://browsersync.io/) ([中文网](http://www.browsersync.cn/)) 浏览器同步测试工具
- [del](https://www.npmjs.com/package/del) 用于删除文件
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- [gulp-compass](https://www.npmjs.com/package/gulp-compass) 用于处理sass文件的工具
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) 用于引用公共模板
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)
- [gulp-tinypng-nokey](https://www.npmjs.com/package/gulp-tinypng-nokey)
- [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) 自动require在package.json中声明的依赖
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) 用于流的顺利进行
- [gulp-preprocess](https://www.npmjs.com/package/gulp-preprocess)
- [gulp-rev](https://www.npmjs.com/package/gulp-rev)
- [gulp-rev-collector](https://www.npmjs.com/package/gulp-rev-collector)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [gulp-zip](https://www.npmjs.com/package/gulp-zip)
- [merge-stream](https://www.npmjs.com/package/merge-stream) 将多个stream合成一个返回
- [yargs](https://www.npmjs.com/package/yargs) Node中处理命令行参数的通用解决方案

## IDE（编辑器）

推荐使用 [VS Code](https://code.visualstudio.com/) ，并安装以下扩展：

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

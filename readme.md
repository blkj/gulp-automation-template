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

## 指令

### 运行指令

```
gulp
```

![](https://i.loli.net/2019/02/02/5c55799b563ba.gif)

### 发布指令

```
gulp build
```

![](https://i.loli.net/2019/02/02/5c55799d3d10b.gif)

> tinypng 的压缩效果比 imagemin 更显著
> 如果使用 tinypng 进行图片压缩，请确保打包时网络畅通

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
  ├─ config.json          项目配置文件
  ├─ gulpfile.js          gulp 配置文件
  └─ package.json         npm 配置文件
```

### 项目配置

`config.json` 将业务代码里，会因为环境不同而变化的数据进行统一配置，常见的有网站标题、接口地址等。

默认配置提供了两套环境，分别为开发环境和生产环境，可根据业务需求自行增加，例如增加测试环境。

```json
"development": {          // 名称，唯一
    "name": "开发环境",    // 名称，用于图形化界面的展示
    "data": {             // 需要用到的数据
        "title": "开发",
        "api": "https://api.douban.com/v2/",
        "local": true
    }
}
```

> 该功能基于 [gulp-preprocess](https://www.npmjs.com/package/gulp-preprocess) 实现

### 功能模块

- [browser-sync](https://browsersync.io/) ([中文网](http://www.browsersync.cn/)) 浏览器同步测试工具
- [del](https://www.npmjs.com/package/del) 用于删除文件
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) 用于引用公共模板
- [gulp-htmlmin](https://www.npmjs.com/package/gulp-htmlmin)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
- [gulp-tinypng-nokey](https://www.npmjs.com/package/gulp-tinypng-nokey)
- [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins) 自动require在package.json中声明的依赖
- [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) 用于流的顺利进行
- [gulp-preprocess](https://www.npmjs.com/package/gulp-preprocess)
- [gulp-rev](https://www.npmjs.com/package/gulp-rev)
- [gulp-rev-collector](https://www.npmjs.com/package/gulp-rev-collector)
- [gulp-sass](https://www.npmjs.com/package/gulp-sass)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
- [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
- [gulp-zip](https://www.npmjs.com/package/gulp-zip)
- [inquirer](https://www.npmjs.com/package/inquirer) 命令行交互工具
- [merge-stream](https://www.npmjs.com/package/merge-stream) 将多个stream合成一个返回
- [node-sass](https://www.npmjs.com/package/node-sass)

## IDE（编辑器）

推荐使用 [VS Code](https://code.visualstudio.com/) ，并安装以下扩展：

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## 相关阅读

- [Gulp 前端自动化工作流](https://hooray.github.io/posts/48995743/)
- [gulp-automation 升级小记](https://hooray.github.io/posts/157bef6b/)

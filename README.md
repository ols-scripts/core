## ols是什么？

ols是一款成熟的脚手架。

它主要具备以下功能：

- **大量的初始化模板**，总有一款满足你的需求，如果没有，也支持自定义模板
- **简单的项目工程化**，不同的模板类型，提供了不同的编译打包方式，让你轻松构建你的项目
- **内置了海量的插件**，可以直接使用内置插件，或者自定义插件

## 发布日志

[CHANGELOG.md](https://github.com/ols-scripts/core/blob/main/CHANGELOG.md)

## 快速上手

### 安装

```bash
yarn global add @ols-scripts/cli
# 或者
npm install -g @ols-scripts/cli
```

### 创建项目

先找个地方建个空目录。

```bash
mkdir myapp && cd myapp
```

通过脚手架创建项目

```bash
ols init

Generate file .docker/Dockerfile
Generate file .docker/entrypoint.sh
Generate file .docker/nginx.conf
Generate file .editorconfig
Generate file .eslintrc.js
Generate file .gitignore
Generate file .npmrc
Generate file .ols.config.ts
Generate file src/pages/404/index.tsx
Generate file src/pages/Home/index.tsx
Generate file src/utils/lazyLoad.ts
Generate file src/utils/request.tsx
Generate file tsconfig.json
... and more
```

### 安装依赖

```bash
yarn

yarn install v1.21.1
[1/4] Resolving packages...
success Already up-to-date.
Done in 0.71s.
```

### 启动项目

```bash
ols dev

Starting the development server...
✔ Webpack
  Compiled successfully in 8.84s
 DONE  Compiled successfully in 8842ms                                       8:06:31 PM
  App running at:
  - Local:   http://127.0.0.1:9000
  - Network: http://172.16.110.178:9000
```

### 构建项目

```bash
ols build

✔ Webpack
  Compiled successfully in 8.84s
 DONE  Compiled successfully in 8842ms
```

### 发布项目

```bash
ols deploy

✔ 发布成功，如需查看发布单详情，请执行 ols deploy --order ${id}
```

## 配置

我们默认约定项目根目录下的.ols.config.[ts|js|tsx|jsx]为配置文件，它的文件内容大体是这样：

```js
module.exports = {
  type: 'project',
  define: {
    GLOBAL_VARIABLE: '123'
  },
  configureWebpack(config, merge) { // 直接修改webpack配置，或者通过webpack-merge
    return merge(config, {
      output: {
        publicPath: 'xxx'
      },
      plugins: [

      ]
    });
  },
  chainWebpack(chian, config) { // 采用链式来修改webpack配置
  },
  plugins: [
    {
      name: '我是A插件',
      fn: (api) => {
        console.log(api.context);
        api.onHook('beforeDevServer', () => {
          console.log('beforeDevServer');
        });
        api.onHook('afterDevServer', (devServer) => {
          console.log(devServer);
        });
        api.onHook('beforeBuild', () => {
          console.log('beforeBuild');
        });
        api.onHook('afterBild', () => {
          console.log('afterBild');
        });
      }
    }
  ] // ols插件
};
```

### type

type字段表明了项目类型，目前支持的类型有`project`、`component`、`node`

### define

define字段可以定义全局变量，如：

```ts
export default {
  define: {
    FOO: 'bar',
  }
}
```

然后你写 console.log(hello, FOO); 会被编译成 console.log(hello, 'bar')。

注意：define 对象的属性值会经过一次 JSON.stringify 转换

内置的 define 属性：process.env.NODE_ENV，值为 development 或 production

### configureWebpack

configureWebpack字段的作用是修改编译/构建前传入的webpackConfig

如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。

```ts
export default {
  configureWebpack: {
    output: {
   publicPath: 'cdn/static/www'
    }
  }
}
```

如果这个值是一个函数，则会接收被解析的配置和merge方法作为参数。该函数需要返回一个被clone获取merge过的配置。

```ts
export default {
  configureWebpack: (config, merge) => {
    return merge(config, {
      output: {
        publicPath: 'cdn/static/www'
      }
   });
  }
}
```

### chainWebpack

通过 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的 API 修改 webpack 配置。

比如：

```ts
export default {
  chainWebpack(chain, config) {
    // 设置 alias
  }
}
```

### plugins

plugins字段允许用户自定义插件，详细内容请看下一节插件内容

## 插件

插件实际上是在脚手架运行过程中的一个个辅助函数，我们可以通过函数暴露出来的`Plugin实例`来完成一系列想要的操作

```ts
export default {
  plugins: [
    {
      name: 'pluginName',
      fn: function(pluginInstance) {
        // do some thing here
      }
    }
  ]
}
```

### pluginInstance

pluginInstance是插件API的实例，通过该实例我们能够在脚手架运行过程的生命周期中处理不同的事情

### pluginInstance.pluginName

获取当前插件的名称

### pluginInstance.logger

获取打印方法

### pluginInstance.context

获取当前上下文

通过当前上下文，我们能够处理很多事情

```ts
// 当前运行命令
context.command = command;

// 当前运行命令参数
context.commandArgs = args;

// 当前运行目录
context.rootDir = rootDir;

// config实例
context.config

// 用户配置目录
context.userConfigDir

// 用户配置
context.userConfig

// 当前运行的所有插件
context.plugins

// 当前的eventHooks
context.eventHooks
```

### pluginInstance.configureWebpack

可以直接调用configureWebpack进行webpack配置修改

```ts
pluginInstance.configureWebpack((config, merge) => {
  return merge(config, {
    output: {
      publicPath: 'cdn/static/www'
    }
  });
})
```

### pluginInstance.chainWebpack

可以直接调用configureWebpack进行webpack配置修改

```ts
pluginInstance.configureWebpack(function(chain, config) {
  // do some thing here
})
```

### pluginInstance.getWebpackConfig

获取当前的webpack配置

```ts
const webpackConfig = pluginInstance.getWebpackConfig();
```

### pluginInstance.getPlugins

获取当前的运行的所有插件

```ts
const plugins = pluginInstance.getPlugins();
```

### pluginInstance.onHook

在不同的生命周期中注册自定义事件，目前只支持以下4种

```ts
// 启动devServer前
pluginInstance.onHook('beforeDevServer', () => {
  console.log('beforeDevServer');
});

// 启动devServer后
pluginInstance.onHook('afterDevServer', (devServer) => {
  console.log(devServer);
});

// build前
pluginInstance.onHook('beforeBuild', () => {
  console.log('beforeBuild');
});

// build后
pluginInstance.onHook('afterBild', () => {
  console.log('afterBild');
});
```

## 命令行

### init

初始化模板

目前模板支持自定义，用户可以在[模板库](https://github.com/ols-scripts/template)中提pr

### dev

编译项目

```bash
ols dev

# 设置端口
ols dev --port 8888

# 开始https调试
ols dev --https

# 开始代码分析
ols dev --analyzer
```

### build

代码打包编译

```bash
ols build

# 开始代码分析
ols dev --analyzer
```

### 常见问题

- 为啥样式有的是css modules，有的不是？
  脚手架会自动识别 CSS Modules 的使用，你把他当做 CSS Modules 用时才是 CSS Modules。

  ```tsx
  // CSS Modules
  import styles from './foo.css';
  // 非 CSS Modules
  import './foo.css';
  ```

- 项目不是通过脚手架初始化的，可以接入脚手架吗？
  当然可以。目前脚手架是支持所有的非服务端的react项目的，接入过程中遇到任何问题，都可以直接@`陌尘`

import logger from '@ols-scripts/util/logger'
import getBabelConfig from '@ols-scripts/config/babel/getBabelConfig'

export default class PluginAPI {
  [x: string]: any

  getBabelConfig = getBabelConfig

  constructor(context, { name, builtIn }) {
    this.context = context

    this.pluginName = name
    this.logger = logger
    this.onHook = this.onHook.bind(this)

    if (!builtIn && this.pluginName) {
      logger.success(`注入插件: ${this.pluginName}`)
    }
  }

  chainWebpack = (fn) => {
    this.context.webpackChainFns.push(fn)
  }

  configureWebpack = (fn) => {
    this.context.webpackConfigFns.push(fn)
  }

  onHook = (key, fn) => {
    if (!Array.isArray(this.context.eventHooks[key])) {
      this.context.eventHooks[key] = []
    }
    this.context.eventHooks[key].push(fn)
  }

  getWebpackConfig = () => {
    return this.context.getWebpackConfig()
  }
}

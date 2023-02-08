import { merge } from 'webpack-merge'
import Chain from 'webpack-chain'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import getBabelConfig from '@ols-scripts/config/babel/getBabelConfig'
import processNodeEnv from '@ols-scripts/util/processNodeEnv'
import getDefaultWebpackConfig from './webpack/config'

class Config {
  [x: string]: any

  getBabelConfig = getBabelConfig

  constructor(ctx) {
    this.ctx = ctx
    // 初始化node env
    processNodeEnv(ctx.commandApi.command)
  }

  getUserConfig() {
    let userConfig
    try {
      userConfig = require(this.ctx.userConfigDir)
    } catch (error) {
      userConfig = {}
    }

    return userConfig
  }

  resolveChainWebpackConfig(webpackConfig) {
    const webpackChain = new Chain()

    this.ctx.webpackChainFns.forEach((fn) => {
      isFunction(fn) && fn(webpackChain)
    })

    return merge(webpackConfig, webpackChain.toConfig())
  }

  resolveConfigureWebpackConfig(config) {
    this.ctx.webpackConfigFns.forEach((fn) => {
      if (isFunction(fn)) {
        const res = fn(config, merge)
        if (res) config = res
      } else if (isObject(fn)) {
        config = merge(config, fn)
      }
    })

    return config
  }

  async getWebpackConfig() {
    // 默认config
    let webpackConfig = getDefaultWebpackConfig(this.ctx)

    // 处理chainWebpack
    webpackConfig = this.resolveChainWebpackConfig(webpackConfig)

    // 处理configureWebpack
    webpackConfig = this.resolveConfigureWebpackConfig(webpackConfig)

    return webpackConfig
  }
}

export default Config

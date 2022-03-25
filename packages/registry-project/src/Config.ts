import { merge } from 'webpack-merge'
import Chain from 'webpack-chain'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import isObject from 'lodash/isObject'
import isFunction from 'lodash/isFunction'
import logger from '@ols-scripts/util/logger'
import getCertificate from '@ols-scripts/config/getCertificate'
import getBabelConfig from '@ols-scripts/config/babel/getBabelConfig'
import processNodeEnv from '@ols-scripts/util/processNodeEnv'
import getDefaultWebpackConfig from './webpack/getDefaultWebpackConfig'

class Config {
  [x: string]: any

  getBabelConfig = getBabelConfig

  constructor(ctx) {
    this.ctx = ctx
    // 初始化node env
    processNodeEnv(ctx.commandApi.command)
  }

  async compileDevConfig(config) {
    const { commandArgs, homeDir } = this.ctx

    if (commandArgs.port) {
      config.devServer.port = commandArgs.port
    }

    if (commandArgs.analyzer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerPort: commandArgs.analyzerPort || '9999',
        }),
      )
    }

    if (commandArgs.https) {
      let httpsConfig
      try {
        const cert: any = await getCertificate(homeDir)
        httpsConfig = {
          key: cert.key,
          cert: cert.cert,
        }
      } catch (e) {
        logger.warning('HTTPS 证书生成失败，已转换为HTTP')
      }
      if (httpsConfig) {
        config.devServer.https = httpsConfig
      }
    }
  }

  compileBuildConfig(config) {
    const { commandArgs } = this.ctx

    if (commandArgs.analyzer) {
      config.devServer.port = commandArgs.port
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerPort: commandArgs.analyzerPort || '9999',
        }),
      )
    }
  }

  async compileCommandArgs(config) {
    switch (this.ctx.commandApi.command) {
      case 'dev':
        await this.compileDevConfig(config)
        break
      case 'build':
        this.compileBuildConfig(config)
        break
      default:
        this.compileBuildConfig(config)
    }
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

    // 处理commandArgs
    await this.compileCommandArgs(webpackConfig)

    return webpackConfig
  }
}

export default Config

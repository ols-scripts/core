import logger from '@ols-scripts/util/logger'
import webpackConfig from './webpack/config'

import dev from './commands/dev'
import build from './commands/build'
import deploy from './commands/deploy'

module.exports = {
  commands: [dev, build, deploy],
  plugins: [],
  preRun: async (ctx) => {
    if (['dev', 'test'].includes(ctx.commandApi.command)) {
      ctx.eventHooks = {}
      ctx.webpackChainFns = []
      ctx.webpackConfigFns = []
      ctx.webpackConfig = webpackConfig(ctx)

      if (ctx.userConfig.chainWebpack) {
        ctx.webpackChainFns.push(ctx.userConfig.chainWebpack)
      }
      if (ctx.userConfig.configureWebpack) {
        ctx.webpackConfigFns.push(ctx.userConfig.configureWebpack)
      }

      ctx.applyHook = async function applyHook(key, opts = {}) {
        const hooks = ctx.eventHooks[key] || []
        const results = []
        hooks.forEach((fn) => {
          try {
            results.push(fn(opts))
          } catch (e) {
            logger(e)
            logger.warning(`执行hooks ${key} 失败`)
          }
        })
        await Promise.all(results)
      }
    }
  },
}

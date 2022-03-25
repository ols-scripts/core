/**
 * 启动服务：cli 调用
 */
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import detect from 'detect-port'

import logger from '@ols-scripts/util/logger'
import checkDepsInstalled from '@ols-scripts/util/checkDepsInstalled'

export default {
  registry: 'dev',
  expand: (program) => {
    program
      .description('开始本地调试')
      .option('-p, --port <port>', '端口号')
      .option('    --analyzer', '开始代码分析')
      .option('-h, --https', '开始https调试')
      .option('    --disabled-open', '编译完默认不打开浏览器')
  },
  action: async (ctx) => {
    const { applyHook, rootDir, webpackConfig } = ctx

    await applyHook('beforeDev')
    if (process.env.IS_DEV === '0') {
      return
    }

    const installedDeps = checkDepsInstalled(rootDir)
    if (!installedDeps) {
      logger.error('项目依赖未安装，请先安装依赖。')
      process.send({ type: 'KILL_DEV' })
      return
    }

    const HOST = '127.0.0.1'
    let PORT = webpackConfig.devServer.port

    const newPort = await detect(PORT)
    if (Number(newPort) !== Number(PORT)) {
      logger.warning(`⚠️  ${PORT} 端口已被占用，已自动切换至 ${newPort} 端口启动`)
      PORT = newPort
      webpackConfig.devServer.port = newPort
    }

    const compiler = webpack(webpackConfig)
    const devServer = new WebpackDevServer(webpackConfig.devServer, compiler)

    compiler.hooks.done.tap('done', (stats) => {
      applyHook('afterDev', stats)
    })

    devServer.listen(PORT, HOST, (err) => {
      if (err) {
        logger.error(err)
        process.send({ type: 'KILL_DEV' })
        process.exit(500)
      } else {
        applyHook('afterDevServer', devServer)
      }
    })
  },
}

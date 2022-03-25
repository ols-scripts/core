import rimraf from 'rimraf'
import logger from '@ols-scripts/util/logger'
import checkDepsInstalled from '@ols-scripts/util/checkDepsInstalled'
import webpack from 'webpack'

export default {
  registry: 'build',
  expand: (program) => {
    program.description('代码打包编译').option('    --analyzer', '开始代码分析')
  },
  action: async (ctx) => {
    const { applyHook, rootDir, webpackConfig } = ctx

    await applyHook('beforeBuild')
    if (process.env.IS_BUILD === '0') {
      return
    }

    const installedDeps = checkDepsInstalled(rootDir)
    if (!installedDeps) {
      logger.error('项目依赖未安装，请先安装依赖。')
      return
    }

    // 先删除文件夹
    rimraf.sync(webpackConfig.output.path)
    console.log(webpackConfig)

    webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.error(error)
      }

      console.log(
        stats.toString({
          colors: true,
          chunks: false,
          children: false,
          modules: false,
          chunkModules: false,
        }),
      )

      if (stats.hasErrors()) {
        logger.error('webpack build failed.')
      }

      logger.success('Build finished')

      applyHook('afterBuild', stats)
    })
  },
}

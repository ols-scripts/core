import rimraf from 'rimraf'
import { join } from 'path'
import logger from '@ols-scripts/util/logger'
import registerBabel from '../rollup/registerBabel'
import getBundleOpts from '../rollup/getBundleOpts'
import rollupRunner from '../rollup/rollupRunner'

export default {
  registry: 'build',
  expand: (program) => {
    program.description('代码打包编译').option('    --analyzer', '开始代码分析')
  },
  action: async (ctx) => {
    registerBabel(ctx)

    const bundleOpts = getBundleOpts(ctx)

    logger('gray', 'Clean dist directory')
    rimraf.sync(join(process.cwd(), 'dist'))

    // Build umd
    if (bundleOpts.umd) {
      logger('cyan', 'Build umd with roolup')
      await rollupRunner(ctx, {
        type: 'umd',
        entry: bundleOpts.entry,
        bundleOpts,
      })
    }

    // Build cjs
    if (bundleOpts.cjs) {
      logger('cyan', 'Build cjs with rollup')
      await rollupRunner(ctx, {
        type: 'cjs',
        entry: bundleOpts.entry,
        bundleOpts,
      })
    }

    // Build esm
    if (bundleOpts.esm) {
      logger('cyan', 'Build esm with rollup')
      // TODO 支持生成esm文件夹？
      await rollupRunner(ctx, {
        type: 'esm',
        entry: bundleOpts.entry,
        bundleOpts,
      })
    }
  },
}

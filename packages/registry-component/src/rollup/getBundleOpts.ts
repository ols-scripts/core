import merge from 'lodash/merge'
import commonjs from 'rollup-plugin-commonjs'
import tsPaths from 'rollup-plugin-tsconfig-paths'
import { join } from 'path'

export default function getBundleOpts(ctx) {
  const { userConfig } = ctx

  const bundleOpts = merge(
    {
      entry: 'src/index.tsx',
      esm: 'rollup',
      cjs: 'rollup',
      extraRollupPlugins: [
        tsPaths({
          tsConfigPath: join(process.cwd(), 'tsconfig.json'),
        }),
        commonjs({
          include: [/node_modules/],
        }),
      ],
      injectCSS: true,
    },
    userConfig,
  )

  if (typeof bundleOpts.esm === 'string') {
    bundleOpts.esm = { type: bundleOpts.esm }
  }
  if (typeof bundleOpts.cjs === 'string') {
    bundleOpts.cjs = { type: bundleOpts.cjs }
  }

  return bundleOpts
}

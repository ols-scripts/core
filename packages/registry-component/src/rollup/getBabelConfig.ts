import { ModuleFormat } from 'rollup'
import getBuiltInBabelConfig from '@ols-scripts/config/babel/getBabelConfig'
import fixBabelPluginImportESM from '../utils/fixBabelPluginImportESM'

interface IGetBabelConfigOpts {
  target: 'browser' | 'node'
  type?: ModuleFormat
  nodeVersion?: number
  extraBabelPlugins: any[]
  extraBabelPreset: any[]
}

export default function getBabelConfig(ctx, bundleType = 'cjs') {
  const { userConfig } = ctx

  const builtInBabelConfig = getBuiltInBabelConfig(false)
  const {
    extraBabelPlugins = [],
    extraBabelPreset = [],
    target = 'browser',
    nodeVersion,
  } = userConfig as IGetBabelConfigOpts

  const isBrowser = target === 'browser'

  const targets = isBrowser ? { browsers: ['last 2 versions', 'ie > 9'] } : { node: nodeVersion || 6 }

  const presetEnvIndex = builtInBabelConfig.presets.findIndex((item) =>
    Array.isArray(item) ? item[0].includes('preset-env') : item.includes('preset-env'),
  )
  // 添加corejs
  presetEnvIndex >= 0 &&
    (builtInBabelConfig.presets[presetEnvIndex] = [
      builtInBabelConfig.presets[presetEnvIndex][0],
      {
        ...builtInBabelConfig.presets[presetEnvIndex][1],
        useBuiltIns: 'usage',
        targets,
      },
    ])

  // 删除auto-css-modules插件
  const autoCssModulesIndex = builtInBabelConfig.plugins.findIndex((item) =>
    item.includes('auto-css-modules'),
  )
  builtInBabelConfig.plugins[autoCssModulesIndex] = [
    require.resolve('@ols-scripts/plugin/rollup-plugin-auto-css-modules'),
    { ctx },
  ]

  // bugfix 特殊处理按需加载的包，保证esm方式引的包也是esm下的
  if (userConfig.type === 'component' && bundleType === 'esm') {
    builtInBabelConfig.plugins = fixBabelPluginImportESM(builtInBabelConfig.plugins)
  }

  return {
    presets: [...extraBabelPreset, ...builtInBabelConfig.presets],
    plugins: [...extraBabelPlugins, ...builtInBabelConfig.plugins],
  }
}

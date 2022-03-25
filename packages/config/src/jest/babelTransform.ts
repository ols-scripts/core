import babelJest from 'babel-jest'
import formatWinPath from '@ols-scripts/util/formatWinPath'
import getBabelConfig from '../babel/getBabelConfig'

const babelConfig = getBabelConfig()
babelConfig.presets = babelConfig.presets.map((preset) => {
  if (Array.isArray(preset) && formatWinPath(preset[0]).indexOf('@babel/preset-env') > -1) {
    return [
      preset[0],
      {
        targets: {
          node: 'current',
        },
      },
    ]
  }
  return preset
})

module.exports = babelJest.createTransformer(babelConfig)

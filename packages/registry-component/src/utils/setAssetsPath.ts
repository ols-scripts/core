import path from 'path'
import last from 'lodash/last'

function getFilename(filePath: string) {
  return last((filePath || '').split('/'))
}

/**
 * 设置输出的文件名称
 *
 * @export
 * @param {*} config
 * @param {string} [outputAssetsPath={ js: '', css: '' }]
 */
export default function setAssetsPath(config, outputAssetsPath = { js: '', css: '' }) {
  config.output.filename = path.join(outputAssetsPath.js, '[name].js')

  const MiniCssExtractPluginIndex = config.plugins.findIndex(
    (item) => item.constructor.name === 'MiniCssExtractPlugin',
  )
  const { options } = config.plugins[MiniCssExtractPluginIndex]

  config.plugins[MiniCssExtractPluginIndex].options = {
    ...options,
    filename: path.join(outputAssetsPath.css, getFilename(options.filename)),
  }
}

export default function fixBabelPluginImportESM(plugins) {
  plugins.forEach((item, index) => {
    if (item?.[0].includes('babel-plugin-import') && ['antd'].includes(item?.[1].libraryName)) {
      plugins[index][1].libraryDirectory = 'es'
    }
  })

  return plugins
}

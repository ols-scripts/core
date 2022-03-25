import { join, relative } from 'path'

module.exports = function demoLoader(markdown) {
  const options = this.getOptions() || {}

  const filePath = this.resourcePath

  const demoDir = join(options.rootDir, options.demoDir)
  const fileName = relative(demoDir, filePath).replace(/\.md$/, '')

  const { meta, content, codes } = options.parser(markdown, {
    fileName,
  })

  return `module.exports = {
    filePath: \`${filePath}\`,
    fileName: \`${fileName}\`,
    meta: ${JSON.stringify(meta)},
    content: \`${content}\`,
    codes: ${JSON.stringify(codes)},
  }`
}

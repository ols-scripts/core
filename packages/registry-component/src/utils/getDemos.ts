import glob from 'glob'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * 获取demos
 *
 * @export
 * @param {*} demoPath
 * @param {*} markdownParser
 * @return {*}
 */
export default function getDemos(demoPath, markdownParser) {
  if (!existsSync(demoPath)) {
    return []
  }

  return glob
    .sync('**', {
      cwd: demoPath,
      nodir: true,
      dot: true,
    })
    .map((name) => {
      const filePath = join(demoPath, name)
      const filename = name.replace(/\.md$/, '')
      const content = readFileSync(filePath, 'utf-8')

      const { meta, codes, content: markdownContent, scopes } = markdownParser(content, {
        fileName: filename,
      })

      return {
        route: filename,
        name: meta.title || name,
        filename,
        filePath,
        meta,
        markdownContent,
        codes,
        scopes,
      }
    })
    .sort(({ meta }, { meta: meta2 }) => {
      return meta.order - meta2.order
    })
}

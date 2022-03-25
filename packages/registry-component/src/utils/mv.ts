import glob from 'glob'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export default function mv(sourceDir, targetDir) {
  glob
    .sync('**', {
      cwd: sourceDir,
      nodir: true,
      dot: true,
    })
    .forEach((item: any) => {
      try {
        // 读取文件
        const tpl = fs.readFileSync(path.join(sourceDir, item))
        // 确保目录一定存在
        mkdirp.sync(path.join(targetDir, path.dirname(item)))
        // 生成文件
        fs.writeFileSync(path.join(targetDir, item), tpl)
      } catch (e) {
        console.error(e)
      }
    })
}

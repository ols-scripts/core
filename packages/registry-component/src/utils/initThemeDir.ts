import path from 'path'
import fs from 'fs'
import ejs from 'ejs'
import mv from '../utils/mv'

export default function initThemeDir({ themeDir, rootDir, demos, scopes }) {
  try {
    fs.statSync(themeDir)
  } catch (error) {
    mv(path.join(__dirname, '../themes'), themeDir)

    const gitIgnoreDir = path.join(rootDir, '.gitignore')
    if (fs.existsSync(gitIgnoreDir)) {
      const gitIgonreStr = fs.readFileSync(gitIgnoreDir, { encoding: 'utf-8' })
      const gitIgonres = (gitIgonreStr || '').split('\n')
      if (!gitIgonres.some((item) => item.startsWith('.ols/themes'))) {
        fs.writeFileSync(gitIgnoreDir, `${gitIgonreStr || ''}\n.ols/themes`)
      }
    }
  }

  const indexTpl = fs.readFileSync(path.join(themeDir, 'markdownData.ejs'), { encoding: 'utf8' })
  fs.writeFileSync(
    path.join(themeDir, 'markdownData.js'),
    ejs.render(indexTpl, {
      demos,
      scopes,
    }),
  )
}

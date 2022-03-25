import path from 'path'
import fs from 'fs'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

export default {
  appDist: resolveApp('dist'),
  appHtml: resolveApp('src/index.html'),
  appIndexJs: resolveApp('src/index.tsx'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  assets: resolveApp('src/assets'),
  appPkg: resolveApp('package.json'),
}

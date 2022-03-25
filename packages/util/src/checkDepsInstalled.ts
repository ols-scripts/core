/**
 * 检测是否安装依赖
 */
import path from 'path'
import fs from 'fs'

export default function checkDepsInstalled(projectDirectory) {
  try {
    fs.statSync(path.resolve(projectDirectory, 'node_modules'))
    return true
  } catch (err) {
    return false
  }
}

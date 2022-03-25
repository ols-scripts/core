const { join, relative } = require('path')

/**
 * 获取demo目录夹名称
 *
 * @export
 * @param {*} rootDir 根目录
 * @param {*} userConfig 用户配置
 * @return {string}
 */
export default function getDemoDir(rootDir, userConfig) {
  if (userConfig && userConfig.demoDir) {
    return relative(rootDir, join(rootDir, userConfig.demoDir))
  }

  return 'docs'
}

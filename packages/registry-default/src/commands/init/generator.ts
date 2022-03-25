import fs from 'fs'
import ejs from 'ejs'
import glob from 'glob'
import path from 'path'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import inquirer from 'inquirer'
import semverValid from 'semver/functions/valid'
import logger from '@ols-scripts/util/logger'
import { getUserConfigPath } from '@ols-scripts/config/getUserConfig'
import { getGitlabRepository, getLastCommit, getTemplateList } from './githubRequest'

let newManifest

/**
 * 获取缓存文件信息
 *
 * @export
 * @return {*}
 */
export function getManifest(homeDir) {
  let manifest: any
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(homeDir, 'manifest.json'), 'utf-8'))
  } catch (e) {
    manifest = {}
  }

  return manifest
}

/**
 * 检测模板是否要更新
 * 1. 判断本地是否有缓存，无缓存直接下载
 * 2. 有缓存，去比较缓存文件和线上版本，无版本变更，直接读取缓存
 * 3. 有版本变更，下载最新版本
 *
 * @export
 * @return {*}
 */
export async function checkVersion(ctx) {
  newManifest = getManifest(ctx.homeDir)
  const lastCommit = await getLastCommit()

  // 无缓存直接下载 || 版本不一致
  if (!(newManifest && newManifest.commit) || lastCommit !== newManifest.commit) {
    newManifest.commit = lastCommit
    return true
  }

  // 版本一致
  logger.success('读取本地缓存成功')
  return false
}

/**
 * 获取用户输入
 *
 * @export
 * @return {*}
 */
export async function getAnswer(isUpdate) {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '请选择您的模板',
      choices: async () => {
        if (!isUpdate) {
          return newManifest.templates || []
        }

        const templates = await getTemplateList()
        const choices = templates.map((item) => ({
          ...item,
          name: `${item.name}${item.description ? `（${item.description}）` : ''}`,
          value: item.path || `./templates/${item.name}`,
        }))

        newManifest.templates = choices
        return choices
      },
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
      default: /(.*\/)?(.+)/.exec(process.cwd())[2], // 默认取当前文件夹名称
    },
    {
      type: 'input',
      name: 'version',
      message: '请输入版本号',
      default: '1.0.0',
      validate: (value) => {
        const pass = semverValid(value)
        if (pass) {
          return true
        }
        return '非法版本号，请输入正确的版本号！'
      },
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入描述',
    },
    {
      type: 'input',
      name: 'author',
    },
    {
      type: 'input',
      name: 'license',
      default: 'ISC',
    },
  ])

  return answer
}

/**
 * 拉取远端模板
 *
 * @export
 * @param {boolean} [isUpdate=true]
 * @param {*} { type = 'project' }
 * @return {*}
 */
export async function fetchTpl(ctx, isUpdate = true) {
  // 使用本地缓存
  if (!isUpdate) {
    return
  }

  const repository = await getGitlabRepository(ctx.homeDir)
  const sourceDir = path.join(ctx.homeDir, (repository[0] as any).path)
  const tplDir = path.join(ctx.homeDir, 'templates')

  // 更新缓存文件信息
  newManifest.create = Date.now()
  fs.writeFileSync(path.join(ctx.homeDir, 'manifest.json'), JSON.stringify(newManifest, null, '  '))

  // 先删除旧文件
  rimraf.sync(tplDir)

  // 移动新文件
  fs.renameSync(path.join(sourceDir, 'templates'), tplDir)

  // 删除新文件
  rimraf.sync(sourceDir)
}

/**
 * 生成静态文件
 *
 * @export
 * @param {*} answers
 */
export async function generatorFiles(ctx, answers: any) {
  const sourceDir = path.join(ctx.homeDir, answers.type)
  const targetDir = process.cwd()

  glob
    .sync('**', {
      cwd: sourceDir,
      nodir: true,
      dot: true,
    })
    .forEach((item: any) => {
      try {
        // loggerArr([{ color: 'cyan', label: 'Generate file ' }, { label: item }])
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

/**
 * 解析文件
 *
 * @export
 * @param {*} answers
 */
export async function compileFiles(answers: any) {
  const tplDir = process.cwd()
  const now = newManifest.templates.find((item) => item.value === answers.type)

  // 重写package.json
  const pkgPath = path.join(tplDir, 'package.json')
  const pkgTpl = fs.readFileSync(pkgPath, { encoding: 'utf8' })
  fs.writeFileSync(pkgPath, ejs.render(pkgTpl, answers))

  // 重写ols.config
  const olsJsPath = getUserConfigPath(tplDir)

  if (olsJsPath) {
    const versionTpl = fs.readFileSync(olsJsPath, { encoding: 'utf8' })
    fs.writeFileSync(olsJsPath, ejs.render(versionTpl, { ...answers, type: now.type }))
  }

  // 如果是组件，需要额外编译demo文件
  if (now.type === 'component') {
    compileDemoFiles(tplDir, answers)
  }
}

/**
 * 编译demo文件
 *
 * @export
 * @param {*} tplDir
 * @param {*} answers
 */
export function compileDemoFiles(tplDir, answers: any) {
  glob
    .sync('**', {
      cwd: tplDir,
      nodir: true,
      dot: true,
    })
    .forEach((item: any) => {
      try {
        if (item.includes('Demo') || item.includes('.md')) {
          // 重写demo文件
          const curPath = path.join(tplDir, item)
          const curTpl = fs.readFileSync(curPath, { encoding: 'utf8' })
          fs.writeFileSync(curPath, ejs.render(curTpl, answers))
        }
      } catch (e) {
        console.error(e)
      }
    })
}

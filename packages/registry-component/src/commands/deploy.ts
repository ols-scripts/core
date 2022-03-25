import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import shelljs from 'shelljs'
import semverInc from 'semver/functions/inc'
import semverValid from 'semver/functions/valid'
import { checkAndCommitRepo, commit, tag, generatorChangelog } from '@ols-scripts/util/git'
import logger from '@ols-scripts/util/logger'

export default {
  registry: 'deploy',
  expand: (program) => {
    program.description('组件发布')
  },
  action: async (ctx) => {
    const packagePath = path.join(ctx.rootDir, 'package.json')
    const packageTpl = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }))

    // 先检测是否提交了代码
    const isCheckRepo = await checkAndCommitRepo()
    if (!isCheckRepo) {
      return
    }

    // 提醒用户是否build过代码
    const { checkBuild } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checkBuild',
        message: '请检查是否已经build代码',
        default: true,
      },
    ])
    if (!checkBuild) {
      return
    }

    // 获取用户输入的版本
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '请选择您发布的版本类型',
        choices: [
          {
            name: '测试版',
            value: 'alpha',
          },
          {
            name: '正式版',
            value: 'patch',
          },
        ],
      },
      {
        type: 'input',
        name: 'version',
        message: `当前版本为${packageTpl.version}，请输入版本号`,
        default: (ans) => {
          switch (ans.type) {
            case 'alpha':
              return semverInc(packageTpl.version, 'prerelease', 'alpha')
            case 'patch':
              return semverInc(packageTpl.version, 'patch')
            default:
              return semverInc(packageTpl.version, 'patch')
          }
        },
        validate: (value) => {
          const pass = semverValid(value)
          if (pass) {
            return true
          }
          return '非法版本号，请输入正确的版本号！'
        },
      },
    ])

    // 修改版本
    const { version } = answers
    packageTpl.version = version
    fs.writeFileSync(packagePath, JSON.stringify(packageTpl, null, '  '))
    await commit(`chore: release ${version}`)

    // 发布到npm：release-it
    try {
      shelljs.exec('npm publish')

      // 生成changelog
      if (/^\d+\.\d+\.\d+$/.test(version)) {
        await generatorChangelog(version)
        await commit(`docs: release ${version} CHANGELOG.md`)
        await tag(version)
      }
    } catch (error) {
      logger.error('发布失败！')
    }
  },
}

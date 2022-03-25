import inquirer from 'inquirer'
import shelljs from 'shelljs'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import simpleGit from 'simple-git/promise'
import logger from './logger'
import { getDays } from './helper'

// 命令所在目录
export const PROJECT_PATH = process.cwd()

const git = simpleGit(PROJECT_PATH)
const changelogPath = path.join(PROJECT_PATH, 'CHANGELOG.md')

export default git

/**
 * 获取分支信息
 *
 * @export
 * @return {*}
 */
export async function getBranch() {
  const branch = await git.branch()
  return branch
}

/**
 * 检测本地仓库git是否干净
 *
 * @export
 * @return {*}
 */
export async function checkAndCommitRepo() {
  // 先检测是否提交了代码
  try {
    const status = await git.status()
    if (status.files.length > 0) {
      const { isCommit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'isCommit',
          message: '检测到你还有代码未提交，是否提交代码？',
          default: true,
        },
      ])
      if (isCommit) {
        try {
          await commit()
          return true
        } catch (error) {
          logger.error('代码提交失败，请检查后再重试！')
          return false
        }
      }
      return true
    }
    return true
  } catch (error) {
    logger.error('仓库未初始化，请先初始化仓库！')
    return false
  }
}

/**
 * 执行commit
 *
 * @export
 * @param {string} [commitMsg]
 */
export async function commit(commitMsg?: string) {
  const { current } = await getBranch()
  if (!commitMsg) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'commitMsg',
        message: '请输入commit-message',
        required: true,
      },
    ])
    commitMsg = answer.commitMsg
  }

  // git提交
  shelljs.exec('git add .')
  shelljs.exec(`git commit -m "${commitMsg}"`)
  shelljs.exec(`git pull origin ${current}`)
  shelljs.exec(`git push origin ${current}`)
}

/**
 * 打tag
 *
 * @export
 * @param {*} version
 */
export async function tag(version) {
  shelljs.exec(`git tag ${version}`)
  shelljs.exec(`git push origin ${version}`)
  shelljs.exec(`git tag -d ${version}`)
}

/**
 * 获取git地址
 *
 * @export
 * @return {*}
 */
export async function getGitUrl() {
  const remote = await git.remote(['--verbose'])
  if (!remote) {
    return ''
  }

  const exec = /origin	(.+)\.git \(fetch\)/.exec(remote || '')
  if (exec && exec.length > 1) {
    return exec[1]
  }

  return ''
}

/**
 * 获取changelog
 *
 * @export
 * @return {*}
 */
export function getChangelog() {
  let changelog = ''
  try {
    changelog = fs.readFileSync(changelogPath, { encoding: 'utf8' })
  } catch (err) {
    console.log(err)
  }

  return changelog
}

/**
 * 生成changelog
 *
 * @export
 * @param {*} version
 */
export async function generatorChangelog(version) {
  shelljs.exec('git fetch origin')

  const { current } = await getBranch()
  const gitUrl = await getGitUrl()
  const tags = await git.tags()
  const lastTag = tags.latest
  let logs

  if (!lastTag) {
    // 之前没打过tag，所有的commit都要记录
    logs = await git.log()
  } else {
    logs = await git.log({ from: lastTag, to: current })
  }

  /**
   * feat：新功能（feature）
   * fix：修补bug
   * docs：文档（documentation）
   * style： 格式（不影响代码运行的变动）
   * refactor：重构（即不是新增功能，也不是修改bug的代码变动）
   * test：增加测试
   * chore：构建过程或辅助工具的变动
   */
  const COMMIT_REG = /^(feat|fix|style|refactor):\s.+/
  const changelogTpl = `## <%= tag %> (2020-11-16)
<% messages.forEach((item)=>{ %>
  <%= item %>
  <% }) %>
`

  const changelogs = logs.all.filter((item) => item.message && COMMIT_REG.test(item.message))
  const messages = changelogs.map(
    (item) => `* ${item.message} ([${item.hash.slice(0, 6)}](${gitUrl}/commit/${item.hash}))`,
  )
  const newLog = ejs.render(changelogTpl, {
    tag: version,
    now: getDays(),
    messages,
  })

  fs.writeFileSync(changelogPath, `${newLog}${getChangelog()}`)
  logger.success('已生成CHANGELOG.md！')
}

import Table from 'cli-table'
import logger from '@ols-scripts/util/logger'
import logSymbols from '@ols-scripts/util/logSymbols'
import { getTimes } from '@ols-scripts/util/helper'

export function loggerArr(arr: any[] = [], color?) {
  const str = arr.reduce((cur, next) => {
    const _color = next.color || color
    return `${cur}${_color ? logger.chalk[_color](next.label) : next.label}`
  }, '')

  console.log(str)
}

export function loggerDeployTable(list = []) {
  const table = new Table({
    style: { head: ['green'] },
    head: ['ID', '分支', '创建时间', '发布说明', 'commit', '版本', '发布人'],
    colWidths: [8, 20, 20, 36, 12, 12, 17],
  })

  // table is an Array, so you can `push`, `unshift`, `splice` and friends
  table.push(...list)

  console.log(table.toString())
}

const COLOR_MAP = {
  success: { symbol: 'success', color: 'cyan' },
  running: { symbol: 'warning', color: 'yellow' },
  failure: { symbol: 'error', color: 'red' },
  waiting_on_dependencies: { symbol: 'info', color: 'white' },
  pending: { symbol: 'info', color: 'white' },
}

function loggerBuild(arr, headEmpty = '', cb?) {
  arr
    .filter((item) => item.status !== 'skipped')
    .forEach((item: any) => {
      const { status, name, started, stopped } = item
      const { color, symbol } = COLOR_MAP[status]
      const time = stopped && started ? getTimes(stopped - started) : ''
      console.log(`${logger.chalk[color](`${headEmpty}${logSymbols[symbol]} ${name}`)}  ${time}`)
      cb && cb(item)
    })
}

export function loggerBuilds(builds) {
  const buildArr = builds.reduce((prev, next) => [...prev, ...next], [])

  loggerBuild(buildArr, ''.padStart(2, ' '), (item) => {
    const { steps = [] } = item
    loggerBuild(steps, ''.padStart(4, ' '))
  })
}

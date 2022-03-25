import chalk from 'chalk'
import logSymbols from './logSymbols'

function logger(color?: string, title?: string) {
  if (typeof title === 'undefined') {
    console.log(color)
    return
  }

  console.log(chalk[color](title))
}

logger.success = (title) => logger('cyan', `${logSymbols.success} ${title}`)
logger.warning = (title) => logger('yellow', `${logSymbols.warning} ${title}`)
logger.error = (title) => logger('red', `${logSymbols.error} ${title}`)
logger.info = (title) => logger('white', `${logSymbols.info} ${title}`)
logger.chalk = chalk

export default logger

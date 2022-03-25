import SpinnerCli from 'cli-spinner'
import chalk from 'chalk'

class Spinner {
  spinner: any

  constructor() {
    this.spinner = SpinnerCli.Spinner()
    this.spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏')
  }

  start(title?: string) {
    if (title) {
      this.spinner.setSpinnerTitle(`${chalk.yellow('%s')} ${title}`)
    }
    this.spinner.start()
  }

  stop(clear: boolean = false) {
    this.spinner.stop(clear)
  }

  clear() {
    this.stop(true)
  }

  setTitle(title: string = '') {
    this.spinner.setSpinnerTitle(title)
  }

  setString(string: string) {
    this.spinner.setSpinnerString(string)
  }
}

export default new Spinner()

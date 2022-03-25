import configWatcher from '@ols-scripts/plugin/config-watcher'
import init from './commands/init'
import test from './commands/test'

export default {
  commands: [init, test],
  plugins: [configWatcher],
}

export const commands = {
  init,
}

export const plugins = {
  configWatcher,
}

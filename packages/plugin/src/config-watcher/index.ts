/**
 * 监听.ols.config配置文件变更，重启应用
 */

import chokidar from 'chokidar'

let server = null
let watcher = null

module.exports = {
  name: 'config-watcher',
  fn({ context, onHook, logger }) {
    const { command, userConfigDir } = context

    if (command === 'dev') {
      if (!watcher) {
        watcher = chokidar.watch(userConfigDir, {
          ignoreInitial: true,
        })

        watcher.on('change', () => {
          logger('cyan', '配置文件已发生变更，正在重启...')
          if (!server) {
            logger('red', 'dev server is not ready')
          } else {
            server.close()
            server = null
            process.send({ type: 'RESTART_DEV' })
          }
        })

        watcher.on('error', () => {
          logger('red', 'fail to watch file')
          process.exit(1)
        })
      }

      onHook('afterDevServer', (devServer) => {
        server = devServer
      })
    }
  },
}

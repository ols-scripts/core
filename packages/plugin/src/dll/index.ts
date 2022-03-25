/**
 * 开启dll
 */

import AutoDllPlugin from 'autodll-webpack-plugin'

module.exports = {
  name: 'auto-dll',
  fn({ context, configureWebpack }) {
    const { command } = context
    if (command === 'dev') {
      configureWebpack((config, merge) => {
        return merge(config, {
          plugins: [
            new AutoDllPlugin({
              inject: true,
              filename: '[name]_[hash].js',
              entry: {
                dll: ['react', 'react-dom'],
              },
              config: {
                mode: 'development',
              },
            }),
          ],
        })
      })
    }
  },
}

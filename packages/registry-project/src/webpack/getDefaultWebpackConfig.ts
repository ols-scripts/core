import devConfig from './webpack.dev'
import prodConfig from './webpack.prod'

export default function getDefaultWebpackConfig(ctx) {
  // 根据 command 返回对应的 webpack config
  switch (ctx.commandApi.command) {
    case 'build':
      return prodConfig(ctx)
    case 'dev':
      return devConfig(ctx)
    default:
      return devConfig(ctx)
  }
}

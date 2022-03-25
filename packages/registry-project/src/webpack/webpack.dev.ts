import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { merge } from 'webpack-merge'
import paths from '@ols-scripts/config/paths'
import base from './webpack.base'

export default function webpackDev(ctx) {
  const plugins: any = [
    new MiniCssExtractPlugin({
      experimentalUseImportModule: false,
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css',
      ignoreOrder: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ]

  // react-refresh不要设置成强配置，M1 computer & node < 15.3会报错：wasm code commit Allocation failed - process out of memory
  if (process.env.REACT_REFERSH && process.env.REACT_REFERSH === 'none') {
    plugins.splice(-1)
  }

  return merge(base(ctx), {
    // @ts-ignore
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      static: {
        directory: paths.appDist,
      },
      compress: true,
      port: 9000,
      historyApiFallback: true,
      liveReload: true,
    },
    plugins,
  })
}

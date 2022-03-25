import webpack from 'webpack'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import base from './webpack.base'

export default function webpackProd(ctx) {
  return merge(base(ctx), {
    // @ts-ignore
    mode: 'production',
    devtool: 'hidden-source-map',
    performance: {
      hints: false,
    },
    plugins: [
      new webpack.ids.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        experimentalUseImportModule: false,
        filename: 'css/[name].[contenthash:5].css',
        chunkFilename: 'css/[name].[contenthash:5].chunk.css',
        ignoreOrder: true,
      }),
      new CompressionPlugin(),
    ] as any,
    optimization: {
      // @ts-ignore
      minimizer: [new CssMinimizerPlugin()],
    },
  })
}

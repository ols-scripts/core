import webpack from 'webpack'
import { existsSync } from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import paths from '@ols-scripts/config/paths'
import getBabelConfig from '@ols-scripts/config/babel/getBabelConfig'
import resolveDefine from '@ols-scripts/config/resolveDefine'

export default function webpackBase(ctx) {
  const env = process.env.NODE_ENV
  const isEnvDevelopment = env === 'development'

  const cssModule = {
    localIdentName: '[local]_[hash:base64:5]',
    exportLocalsConvention: 'camelCase',
  }

  const miniCssExtractPluginConfig = {
    loader: MiniCssExtractPlugin.loader,
    options: {},
  }

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [
          autoprefixer({
            remove: false,
            grid: true,
            flexbox: true,
          }),
        ],
      },
    },
  }

  const htmlWebpackName = existsSync(paths.appPkg) ? require(paths.appPkg).name : ''

  const { define } = ctx.userConfig

  return {
    entry: paths.appIndexJs,
    output: {
      path: paths.appDist,
      filename: isEnvDevelopment ? 'js/[name].js' : 'js/[name].[contenthash:5].js',
      chunkFilename: isEnvDevelopment ? 'js/[name].chunk.js' : 'js/[name].[contenthash:5].chunk.js',
    },
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '@': paths.appSrc,
      },
    },
    stats: 'errors-warnings',
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          defaultVendors: {
            test: paths.appNodeModules,
            name: 'vendors',
            chunks: 'all',
          },
        },
        maxSize: 3000 * 1000,
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: htmlWebpackName,
        filename: 'index.html',
        template: paths.appHtml,
        minify: false,
      }),
      new webpack.DefinePlugin(
        resolveDefine({
          define: define || {},
        }),
      ),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: paths.appSrc,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelConfig(isEnvDevelopment),
            },
          ].filter(Boolean),
        },
        {
          test: /\.css$/,
          include: [paths.appNodeModules, paths.assets],
          use: [
            miniCssExtractPluginConfig,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            postcssLoader,
          ],
        },
        {
          test: /\.css$/,
          exclude: [paths.appNodeModules, paths.assets],
          oneOf: [
            {
              resourceQuery: /css_modules/,
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: cssModule,
                  },
                },
                postcssLoader,
              ],
            },
            {
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
                postcssLoader,
              ],
            },
          ],
        },
        {
          test: /\.less$/,
          include: [paths.appNodeModules],
          use: [
            miniCssExtractPluginConfig,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
              },
            },
            postcssLoader,
            {
              loader: require.resolve('less-loader'),
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.(scss|sass)$/,
          include: [paths.appNodeModules],
          use: [
            miniCssExtractPluginConfig,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
              },
            },
            postcssLoader,
            require.resolve('sass-loader'),
          ],
        },
        {
          test: /\.less$/,
          exclude: paths.appNodeModules,
          oneOf: [
            {
              resourceQuery: /css_modules/,
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                    modules: cssModule,
                  },
                },
                postcssLoader,
                {
                  loader: require.resolve('less-loader'),
                  options: {
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
            {
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                  },
                },
                postcssLoader,
                {
                  loader: require.resolve('less-loader'),
                  options: {
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          test: /\.(scss|sass)$/,
          exclude: paths.appNodeModules,
          oneOf: [
            {
              resourceQuery: /css_modules/,
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                    modules: cssModule,
                  },
                },
                postcssLoader,
                require.resolve('sass-loader'),
              ],
            },
            {
              use: [
                miniCssExtractPluginConfig,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 2,
                  },
                },
                postcssLoader,
                require.resolve('sass-loader'),
              ],
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8192,
            },
          },
          generator: {
            filename: 'images/[name].[hash:5].[ext]',
            publicPath: '../',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:5].[ext]',
            publicPath: '../',
          },
        },
      ],
    },
  }
}

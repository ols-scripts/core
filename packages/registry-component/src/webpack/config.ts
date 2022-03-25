import webpack from 'webpack'
import { existsSync } from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import autoprefixer from 'autoprefixer'
import paths from '@ols-scripts/config/paths'
import getBabelConfig from '@ols-scripts/config/babel/getBabelConfig'
import resolveDefine from '@ols-scripts/config/resolveDefine'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import path from 'path'
import { parseMarkdownParts } from './markdownHelper'
import getDemoDir from '../utils/getDemoDir'
import getDemos from '../utils/getDemos'
import initThemeDir from '../utils/initThemeDir'

export default function webpackConfig(ctx) {
  const { rootDir, userConfig } = ctx
  const pkgName = existsSync(paths.appPkg) ? require(paths.appPkg).name : ''
  const markdownParser = parseMarkdownParts(rootDir)
  const demoDir = getDemoDir(rootDir, userConfig)
  const demos = getDemos(path.join(rootDir, demoDir), markdownParser)
  const scopes = demos.reduce((pre, next) => pre.concat(next.scopes || []), [])
  const themeDir = path.join(rootDir, '.ols', 'themes')

  initThemeDir({ themeDir, rootDir, demos, scopes })

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

  return {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      static: {
        directory: paths.appDist,
      },
      compress: true,
      port: 8888,
      historyApiFallback: true,
      liveReload: true,
    },
    entry: path.join(themeDir, 'index'),
    output: {
      path: paths.appDist,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].chunk.js',
    },
    target: ['web', 'es5'],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      alias: {
        '@': paths.appSrc,
        [pkgName]: path.join(rootDir, 'src/index'),
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
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: pkgName,
        filename: 'index.html',
        template: path.join(themeDir, 'index.html'),
        minify: false,
      }),
      new webpack.DefinePlugin(
        resolveDefine({
          define: userConfig.define || {},
        }),
      ),
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
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: paths.appSrc,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelConfig(true),
            },
          ].filter(Boolean),
        },
        {
          test: /\.tsx?$/,
          include: themeDir,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: getBabelConfig(true),
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
        {
          test: /\.md$/,
          loader: require.resolve('./componentDemoLoader'),
          options: {
            parser: markdownParser,
            demos,
            rootDir: ctx.rootDir,
            demoDir,
          },
        },
      ],
    },
  }
}

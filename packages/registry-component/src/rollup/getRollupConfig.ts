import { existsSync } from 'fs'
import { basename, extname, join } from 'path'
import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import tsPaths from 'rollup-plugin-tsconfig-paths'
import inject, { RollupInjectOptions } from '@rollup/plugin-inject'
import babel from '@rollup/plugin-babel'
import postcss from '@ols-scripts/plugin/rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'
import camelCase from 'lodash/camelcase'
import tempDir from 'temp-dir'
import autoprefixer from 'autoprefixer'
import NpmImport from 'less-plugin-npm-import'
import svgr from '@svgr/rollup'
import getBabelConfig from './getBabelConfig'

interface IPkg {
  dependencies?: Record<string, any>
  peerDependencies?: Record<string, any>
  name?: string
}

export default function getRollupConfig(ctx, opts) {
  const { type, entry, bundleOpts } = opts
  const {
    umd,
    esm,
    cjs,
    extractCSS = false,
    injectCSS = true,
    cssModules: modules,
    extraPostCSSPlugins = [],
    extraRollupPlugins = [],
    extraPostCSSOpts = {},
    autoprefixer: autoprefixerOpts,
    include = /node_modules/,
    replace: replaceOpts,
    inject: injectOpts,
    extraExternals = [],
    externalsExclude = [],
    typescriptOpts,
    nodeResolveOpts = {},
    disableTypeCheck,
    lessInRollupMode = {},
    sassInRollupMode = {},
  } = bundleOpts
  const entryExt = extname(entry)
  const name = basename(entry, entryExt)
  const isTypeScript = entryExt === '.ts' || entryExt === '.tsx'
  const extensions = ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs']
  const cwd = process.cwd()

  let pkg = {} as IPkg
  try {
    pkg = require(join(cwd, 'package.json')) // eslint-disable-line
  } catch (e) {
    console.log(e)
  }

  // babel参数
  const babelOpts = {
    ...getBabelConfig(ctx, type),
    babelHelpers: 'bundled' as any,
    exclude: /\/node_modules\//,
    babelrc: false,
    extensions,
  }

  // css modules参数
  const cssModules = {
    localsConvention: 'camelCase',
    ...modules,
  }

  // rollup configs
  const input = join(cwd, entry)
  const format = type

  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...extraExternals,
  ]
  // umd 只要 external peerDependencies
  const externalPeerDeps = [...Object.keys(pkg.peerDependencies || {}), ...extraExternals]

  function getPkgNameByid(id) {
    const splitted = id.split('/')
    if (id.charAt(0) === '@' && splitted[0] !== '@' && splitted[0] !== '@tmp') {
      return splitted.slice(0, 2).join('/')
    }
    return id.split('/')[0]
  }

  function testExternal(pkgs, excludes, id) {
    if (excludes.includes(id)) {
      return false
    }
    return pkgs.includes(getPkgNameByid(id))
  }

  const terserOpts = {
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }

  function getPlugins(opts = {} as { minCSS: boolean }) {
    const { minCSS } = opts
    return [
      url(),
      svgr(),
      postcss({
        ctx,
        extract: extractCSS,
        inject: injectCSS,
        modules: cssModules,
        minimize: !!minCSS,
        autoModules: true,
        use: {
          less: {
            plugins: [new NpmImport({ prefix: '~' })],
            javascriptEnabled: true,
            ...lessInRollupMode,
          },
          sass: {
            ...sassInRollupMode,
          },
          stylus: false,
        },
        plugins: [
          autoprefixer({
            // https://github.com/postcss/autoprefixer/issues/776
            remove: false,
            ...autoprefixerOpts,
          }),
          ...extraPostCSSPlugins,
        ],
        ...extraPostCSSOpts,
      }),
      ...(injectOpts ? [inject(injectOpts as RollupInjectOptions)] : []),
      ...(replaceOpts && Object.keys(replaceOpts || {}).length ? [replace(replaceOpts)] : []),
      nodeResolve({
        mainFields: ['module', 'jsnext:main', 'main'],
        extensions,
        ...nodeResolveOpts,
      }),
      ...(isTypeScript
        ? [
            typescript2({
              cwd,
              clean: true,
              cacheRoot: `${tempDir}/.rollup_plugin_typescript2_cache`,
              // 支持往上找 tsconfig.json
              // 比如 lerna 的场景不需要每个 package 有个 tsconfig.json
              tsconfig: [join(cwd, 'tsconfig.json'), join(cwd, '../../tsconfig.json')].find(existsSync),
              tsconfigDefaults: {
                compilerOptions: {
                  // Generate declaration files by default
                  declaration: true,
                },
              },
              tsconfigOverride: {
                compilerOptions: {
                  // Support dynamic import
                  target: 'esnext',
                },
              },
              check: !disableTypeCheck,
              ...(typescriptOpts || {}),
            }),
          ]
        : []),
      babel(babelOpts),
      json(),
      tsPaths({
        tsConfigPath: join(process.cwd(), 'tsconfig.json'),
      }),
      commonjs({
        include: [/node_modules/],
      }),
      ...(extraRollupPlugins || []),
    ]
  }

  switch (type) {
    case 'esm':
      return [
        {
          input,
          output: {
            format,
            file: join(cwd, `dist/${(esm && (esm as any).file) || `${name}.esm`}.js`),
            exports: 'named',
          },
          plugins: [...getPlugins(), ...(esm && (esm as any).minify ? [terser(terserOpts)] : [])],
          external: testExternal.bind(null, external, externalsExclude),
        },
        ...(esm && (esm as any).mjs
          ? [
              {
                input,
                output: {
                  format,
                  file: join(cwd, `dist/${(esm && (esm as any).file) || `${name}`}.mjs`),
                  exports: 'named',
                },
                plugins: [
                  ...getPlugins(),
                  replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                  }),
                  terser(terserOpts),
                ],
                external: testExternal.bind(null, externalPeerDeps, externalsExclude),
              },
            ]
          : []),
      ]

    case 'cjs':
      return [
        {
          input,
          output: {
            format,
            file: join(cwd, `dist/${(cjs && (cjs as any).file) || name}.js`),
            exports: 'named',
          },
          plugins: [...getPlugins(), ...(cjs && (cjs as any).minify ? [terser(terserOpts)] : [])],
          external: testExternal.bind(null, external, externalsExclude),
        },
      ]

    case 'umd':
      // Add umd related plugins
      // eslint-disable-next-line no-case-declarations
      const extraUmdPlugins = [
        commonjs({
          include,
          // namedExports options has been remove from https://github.com/rollup/plugins/pull/149
        }),
      ]

      return [
        {
          input,
          output: {
            format,
            sourcemap: umd && umd.sourcemap,
            file: join(cwd, `dist/${(umd && umd.file) || `${name}.umd`}.js`),
            globals: umd && umd.globals,
            name: (umd && umd.name) || (pkg.name && camelCase(basename(pkg.name))),
            exports: 'named',
          },
          plugins: [
            ...getPlugins(),
            ...extraUmdPlugins,
            replace({
              'process.env.NODE_ENV': JSON.stringify('development'),
            }),
          ],
          external: testExternal.bind(null, externalPeerDeps, externalsExclude),
        },
        ...(umd && umd.minFile === false
          ? []
          : [
              {
                input,
                output: {
                  format,
                  sourcemap: umd && umd.sourcemap,
                  file: join(cwd, `dist/${(umd && umd.file) || `${name}.umd`}.min.js`),
                  globals: umd && umd.globals,
                  name: (umd && umd.name) || (pkg.name && camelCase(basename(pkg.name))),
                  exports: 'named',
                },
                plugins: [
                  ...getPlugins({ minCSS: true }),
                  ...extraUmdPlugins,
                  replace({
                    'process.env.NODE_ENV': JSON.stringify('production'),
                  }),
                  terser(terserOpts),
                ],
                external: testExternal.bind(null, externalPeerDeps, externalsExclude),
              },
            ]),
      ]

    default:
      throw new Error(`Unsupported type ${type}`)
  }
}

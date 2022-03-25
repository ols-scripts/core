import resolvePlugin from './resolvePlugin'

export default function getBabelConfig(isEnvDevelopment = false) {
  const plugins = [
    ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'lib', style: true }, 'antd'],
    '@babel/plugin-syntax-dynamic-import',
    '@ols-scripts/plugin/auto-css-modules',
    process.env.REACT_REFERSH !== 'none' && isEnvDevelopment && require.resolve('react-refresh/babel'),
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    'babel-plugin-lodash',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', {}],
  ]

  return {
    presets: resolvePlugin([
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'entry',
          corejs: 3,
        },
      ],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ]),
    plugins: resolvePlugin(plugins),
    cacheDirectory: true,
  }
}

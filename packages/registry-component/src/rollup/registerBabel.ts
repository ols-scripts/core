import getBabelConfig from './getBabelConfig'

export default function registerBabel(ctx) {
  const { userConfigDir } = ctx
  const babelConfig = getBabelConfig(ctx)

  require('@babel/register')({
    ...babelConfig,
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
    only: [userConfigDir],
    babelrc: false,
    cache: false,
  })
}

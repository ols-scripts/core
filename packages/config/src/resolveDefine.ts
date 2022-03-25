export default function resolveDefine(opts: { define: any }) {
  const env = {}
  Object.keys(process.env).forEach((key) => {
    if (key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })

  Object.keys(env).forEach((key) => {
    env[key] = JSON.stringify(env[key])
  })

  const define = {}
  if (opts.define) {
    Object.keys(opts.define).forEach((key) => {
      define[key] = JSON.stringify(opts.define[key])
    })
  }

  return {
    'process.env': env,
    ...define,
  }
}

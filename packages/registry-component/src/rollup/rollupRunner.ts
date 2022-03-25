import { OutputOptions, rollup } from 'rollup'
import getRollupConfig from './getRollupConfig'

async function build(ctx, opts) {
  const rollupConfigs = getRollupConfig(ctx, opts)

  for (let rollupConfig of rollupConfigs) {
    const { output, ...input } = rollupConfig
    const bundle = await rollup(input)
    await bundle.write(output as OutputOptions)
  }
}

export default async function rollupRunner(ctx, opts) {
  if (Array.isArray(opts.entry)) {
    for (let entry of opts.entry) {
      await build(ctx, { ...opts, entry })
    }
  } else {
    await build(ctx, opts)
  }
}

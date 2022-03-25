import { pickPropertyByArr } from '@ols-scripts/util/helper'

export function getPreRunFunction(registry) {
  if (!Array.isArray(registry)) {
    return registry.preRun || (() => {})
  }

  return async (ctx) => {
    const preRuns = registry
      .map((item) => item.preRun)
      .filter(Boolean)
      .map((item) => item(ctx))
    await Promise.all(preRuns)
  }
}

export function getBuiltInPlugins(registry) {
  if (!Array.isArray(registry)) {
    return registry.plugins || []
  }

  return pickPropertyByArr(registry, 'plugins')
}

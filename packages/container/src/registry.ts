import defaultRegistry from '@ols-scripts/registry-default'

enum ContainerType {
  Project = 'project',
  Component = 'component',
}

export function getRegistry(type: ContainerType) {
  if (!type) {
    return defaultRegistry
  }

  try {
    const typeRegistry = require(`@ols-scripts/registry-${type}`)
    return [defaultRegistry, typeRegistry]
  } catch (error) {
    console.log(error)
    return defaultRegistry
  }
}

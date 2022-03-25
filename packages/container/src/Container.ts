import { getPreRunFunction, getBuiltInPlugins } from './helper'
import { getRegistry } from './registry'

class Container {
  type: string
  registry: any
  ctx: any

  constructor(type) {
    this.type = type
    this.registry = getRegistry(type)
  }

  bindContext(ctx) {
    this.ctx = ctx
  }

  getPlugins() {
    const builtInPlugins = getBuiltInPlugins(this.registry).map((item) => ({ ...item, builtIn: true }))

    return builtInPlugins.concat(this.ctx.userConfig.plugins || [])
  }

  runPlugins() {
    const { PluginAPI } = this.ctx
    const plugins = this.getPlugins()
    plugins.forEach(({ name, fn, builtIn }) => {
      fn(new PluginAPI(this, { name, builtIn }))
    })
  }

  async run() {
    const preRun = getPreRunFunction(this.registry)

    this.ctx.commandApi.runCommands(this.registry, preRun)

    this.runPlugins()
  }
}

export default Container

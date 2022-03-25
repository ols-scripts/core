import path from 'path'
import os from 'os'
import getUserConfig, { getUserConfigPath } from '@ols-scripts/config/getUserConfig'
import Container from '@ols-scripts/container'
import CommandAPI from './Command'
import PluginAPI from './Plugin'

class Context {
  // static PluginAPI = PluginAPI

  version: string
  homeDir: string
  rootDir: string
  userConfigDir: string
  userConfig: Record<string, any>
  container: Container
  commandApi: CommandAPI
  PluginAPI: any
  commandArgs: Record<string, any>

  constructor(version) {
    this.version = version
    this.homeDir = path.join(os.homedir(), '.ols')
    this.rootDir = process.cwd()
    this.userConfigDir = getUserConfigPath()
    this.userConfig = getUserConfig()

    this.container = this.initContainer()

    this.commandApi = new CommandAPI(this)
    this.PluginAPI = PluginAPI
  }

  initContainer() {
    const container = this.getContainer()
    container.bindContext(this)

    return container
  }

  getContainer() {
    /**
     * 1. 判断是否有自定义container，没有到2
     * 2. 判断type类型，没有到3
     * 3. 取default container
     * 4. 返回container
     */
    const { type, container } = this.userConfig

    if (container && container instanceof Container) {
      return container
    }

    return new Container(type)
  }

  run() {
    this.container.run()
  }
}

export default Context

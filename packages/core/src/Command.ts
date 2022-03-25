import commander, { program } from 'commander'
import logger from '@ols-scripts/util/logger'
import { pickPropertyByArr } from '@ols-scripts/util/helper'
import Context from './Context'

type CommandApiType = {
  registry: string
  expand?: (p: commander.Command, ctx?: any) => void
  action: (ctx, result?: any) => void
}

export default class CommandAPI {
  context: Context
  program: commander.Command
  command: string

  constructor(context) {
    this.context = context
    this.program = program
    this.program.version(this.context.version)
    this.command = process.argv?.[2]
  }

  runCommands(registry, preRun) {
    const commands = [...this.getCommands(registry), ...(this.context.userConfig.commands || [])]

    commands.forEach((commandApi) => {
      const commandIns = this.program.command(commandApi.registry)
      if (commandApi.expand) {
        try {
          commandApi.expand(commandIns, this.context)
        } catch (error) {
          logger.error(`[Type Error]: Can't expand [${commandApi.registry}]`)
        }
      }
      commandIns.action(async (result) => {
        this.context.commandArgs = result
        preRun && (await preRun(this.context, result))
        await commandApi.action(this.context, result)
      })
    })

    this.program.parse(process.argv)
    if (!this.command) {
      this.program.help()
    }
  }

  getCommands(registry): CommandApiType[] {
    if (!Array.isArray(registry)) {
      return registry.commands || []
    }

    return pickPropertyByArr(registry, 'commands')
  }
}

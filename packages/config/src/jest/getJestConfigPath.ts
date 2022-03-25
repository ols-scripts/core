import { existsSync } from 'fs'
import { join } from 'path'

export const CONFIG_FILES = ['jest.config.js', 'jest.config.ts']

export function getExistFile({ cwd, files }) {
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const absFilePath = join(cwd, file)
    if (existsSync(absFilePath)) {
      return absFilePath
    }
  }
}

export default function getJestConfigPath(ctx) {
  const { rootDir, commandArgs } = ctx

  const configFile = getExistFile({
    cwd: rootDir,
    files: [...CONFIG_FILES, commandArgs.config].filter(Boolean),
  })

  return configFile
}

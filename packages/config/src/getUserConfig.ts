import { existsSync } from 'fs'
import { join } from 'path'

export const CONFIG_FILES = ['.ols.config.js', '.ols.config.jsx', '.ols.config.ts', '.ols.config.tsx']

export function getExistFile({ cwd, files }) {
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const absFilePath = join(cwd, file)
    if (existsSync(absFilePath)) {
      return absFilePath
    }
  }
}

export function getUserConfigPath(cwd = process.cwd()) {
  const configFile = getExistFile({
    cwd,
    files: CONFIG_FILES,
  })

  return configFile
}

export default function getUserConfig() {
  let userConfig
  try {
    userConfig = require(getUserConfigPath())
  } catch (error) {
    userConfig = {}
  }

  return userConfig
}

#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import os from 'os'
import mkdirp from 'mkdirp'
import { Context } from '@ols-scripts/core'
import logger from '@ols-scripts/util/logger'

const pkg = require('../package.json')

logger(`当前运行版本：${logger.chalk.cyan(pkg.version)}\n`)

const rootDir = path.join(os.homedir(), '.ols')
if (!fs.existsSync(rootDir)) {
  mkdirp.sync(rootDir)
}

const ctx = new Context(pkg.version)
ctx.run()

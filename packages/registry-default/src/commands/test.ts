import fs from 'fs'
import path from 'path'
import { runCLI } from 'jest'
import getJestConfigPath from '@ols-scripts/config/jest/getJestConfigPath'

function getSetupFiles(paths) {
  return paths.filter((item) => fs.existsSync(item))
}

export default {
  registry: 'test',
  expand: (program) => {
    program.description('开始测试用例').option('    --coverage', '生成测试覆盖率')
  },
  action: (ctx) => {
    const { rootDir, webpackConfig, commandArgs } = ctx

    const jestConfigPath = getJestConfigPath(ctx)
    let userJestConfig = {}
    if (fs.existsSync(jestConfigPath)) {
      userJestConfig = require(jestConfigPath)
    }

    // get webpack.resolve.alias
    const { alias } = webpackConfig?.resolve || {}
    const aliasModuleNameMapper = {}
    Object.keys(alias || {}).forEach((key) => {
      const aliasPath = alias[key]
      // check path if it is a directory
      if (fs.existsSync(aliasPath) && fs.statSync(aliasPath).isDirectory()) {
        aliasModuleNameMapper[`^${key}/(.*)$`] = `${aliasPath}/$1`
      }
      aliasModuleNameMapper[`^${key}$`] = aliasPath
    })

    const jestConfig = {
      collectCoverageFrom: [
        'index.{js,jsx,ts,tsx}',
        'src/**/*.{js,jsx,ts,tsx}',
        '!**/typings/**',
        '!**/types/**',
        '!**/fixtures/**',
        '!**/examples/**',
        '!**/*.d.ts',
      ].filter(Boolean),
      rootDir,
      setupFiles: [require.resolve('@ols-scripts/config/jest/shim')],
      testMatch: ['**/?*.(spec|test).(j|t)s?(x)'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': require.resolve('@ols-scripts/config/jest/babelTransform'),
        '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': require.resolve('@ols-scripts/config/jest/fileTransform'),
      },
      transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss|less)$',
      ],
      moduleNameMapper: {
        ...aliasModuleNameMapper,
      },
      moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
      testPathIgnorePatterns: ['/node_modules/'],
      setupFilesAfterEnv: getSetupFiles([
        path.join(rootDir, 'setup.js'),
        path.join(rootDir, 'setup.ts'),
        path.join(rootDir, '__tests__', 'setup.js'),
        path.join(rootDir, '__tests__', 'setup.ts'),
      ]),
      ...userJestConfig,
    }

    runCLI(
      {
        ...commandArgs,
        config: JSON.stringify(jestConfig),
      },
      [rootDir],
    )
      .then((res) => {
        const { results } = res
        if (!results.success) {
          console.log(Error('Jest failed'))
          process.exit()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
}

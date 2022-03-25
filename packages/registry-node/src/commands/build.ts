import shelljs from 'shelljs'

export default {
  registry: 'dev',
  expand: (program) => {
    program.description('代码打包编译')
  },
  action: async () => {
    shelljs.exec('yarn build')
  },
}

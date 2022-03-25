import shelljs from 'shelljs'

export default {
  registry: 'dev',
  expand: (program) => {
    program.description('开始本地调试')
  },
  action: async () => {
    shelljs.exec('yarn dev')
  },
}

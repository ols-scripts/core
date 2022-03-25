import { checkVersion, fetchTpl, compileFiles, generatorFiles, getAnswer } from './generator'

export default {
  registry: 'init',
  expand: (program) => {
    program.description('选择模板')
  },
  action: async (ctx) => {
    // 1. 检测是否要更新
    const isUpdate = await checkVersion(ctx)

    // 2. 获取用户输入
    const answers = await getAnswer(isUpdate)

    // 3. 下载模板文件
    await fetchTpl(ctx, isUpdate)

    // 4. 生成静态文件
    await generatorFiles(ctx, answers)

    // 5. 解析文件
    await compileFiles(answers)
  },
}

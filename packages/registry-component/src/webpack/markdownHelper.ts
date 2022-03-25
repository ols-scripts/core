import yaml from 'js-yaml'
import path from 'path'
import bableCompile from './bableCompile'
import { getRandomStr } from '../utils/helper'

const acorn = require('acorn')
const acornJsx = require('acorn-jsx')

const JSXParser = acorn.Parser.extend(acornJsx())

function splitMeta(mdContent) {
  // 获取 meta 信息
  function split(str) {
    if (str.slice(0, 3) !== '---') return
    const matcher = /\n(\.{3}|-{3})/g
    const metaEnd = matcher.exec(str)
    return metaEnd && [str.slice(0, metaEnd.index), str.slice(matcher.lastIndex)]
  }

  const splited = split(mdContent)

  if (splited) {
    return {
      meta: yaml.load(splited[0]),
      mdContent: splited[1],
    }
  }

  return {
    meta: '',
    mdContent,
  }
}

function getScopes(code) {
  const ast = JSXParser.parse(code, {
    ecmaVersion: 2020,
    sourceType: 'module',
  })

  const scopes = []

  ast.body.forEach(({ type, source }) => {
    if (type === 'ImportDeclaration') {
      const dependencyName = source.value

      dependencyName && scopes.push(dependencyName)
    }
  })

  return scopes
}

const liveLang = ['jsx', 'tsx']

/**
 * 解析md文件
 * 获取meta、content、code、compiledCode
 * content会直接吐给server进行渲染
 * compiledCode会吐给md-loader，进行拼接，最后生成index.js
 *
 * @export
 * @param {*} babelConfig
 * @return {*}
 */
export function parseMarkdownParts(rootDir) {
  return function markdownHelper(mdContent) {
    const splitResult = splitMeta(mdContent)
    const { meta } = splitResult
    mdContent = splitResult.mdContent

    let codes = []
    const md = require('markdown-it')({
      html: true,
      highlight: (hitCode, lang) => {
        const id = getRandomStr()
        codes.push({
          id,
          code: hitCode,
          lang,
        })

        return `<div id=${id}></div>`
      },
    })

    let scopes = []
    const content = md.render(mdContent)
    const codeTokens = md.parse(mdContent).filter((item) => item.tag === 'code')
    codes = codes.map((item, index) => {
      let compileCode = ''
      const info = codeTokens[index].info || ''
      const isLive = info.split(' ').includes('live')

      if (liveLang.includes(item.lang) && isLive) {
        compileCode = bableCompile(item.code)
        scopes = scopes.concat(getScopes(item.code))
      }

      return {
        ...item,
        compileCode,
        isLive,
        info,
      }
    })

    const pkg = require(path.join(rootDir, 'package.json'))
    scopes = [
      ...scopes.map((item) => ({ dependence: item, require: item })),
      { dependence: pkg.name, require: path.join(rootDir, 'src/index') },
    ]

    return {
      meta,
      codes,
      content,
      scopes,
    }
  }
}

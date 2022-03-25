/**
 * fork from https://github.com/umijs/umi/blob/2de577ed78/packages/babel-plugin-auto-css-modules/src/index.ts
 * 作用：babel编译的时候，使用插件将引入不同的css文件做区分
 * import './index.css';  这种引入的AST的specifiers= []
 * import styles from './index.css';   这种引入的AST的specifiers= [{
    "type": "ImportDefaultSpecifier",
    "start": 7,
    "end": 13,
    "local": {
      "type": "Identifier",
      "start": 7,
      "end": 13,
      "name": "styles"
    }
  }]
 * 通过specifiers的长度来区分，并向文件缀一个css_modules query 参数。该参数用于后面在 webpack 中区分是否启用 CSS Modules
 * 后续在webpack配置loader的时候，通过resourceQuery来判断是否需要添加css modules
 */
import { NodePath, Visitor } from '@babel/traverse'
import { extname } from 'path'

export interface IOpts {
  flag?: string
}

const CSS_EXTNAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function autoCssModules() {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<any>, { opts }: { opts: IOpts }) {
        const {
          specifiers,
          source,
          source: { value },
        } = path.node
        if (specifiers.length && CSS_EXTNAMES.includes(extname(value))) {
          source.value = `${value}?${opts.flag || 'css_modules'}`
        }
      },
    } as Visitor,
  }
}

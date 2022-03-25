import { NodePath, Visitor } from '@babel/traverse'
import { extname, resolve, dirname } from 'path'

export interface IOpts {
  ctx?: any
}

const CSS_EXTNAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function autoCssModules() {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<any>, { opts, filename }: { opts: IOpts; filename: string }) {
        const {
          specifiers,
          source: { value },
        } = path.node
        if (specifiers.length && CSS_EXTNAMES.includes(extname(value))) {
          const { ctx } = opts
          const cssFilename = resolve(dirname(filename), value)
          ctx.cssModules = [...(ctx.cssModules || []), cssFilename]
        }
      },
    } as Visitor,
  }
}

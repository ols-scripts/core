import { transform as babelTransform } from '@babel/standalone'

export default function bableCompile(source) {
  const tcode = babelTransform(source, { presets: ['env', 'react'] }).code

  return tcode
}

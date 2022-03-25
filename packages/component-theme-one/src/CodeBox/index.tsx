import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { LiveProvider } from '../ReactLive'
import Wrapper from './Wrapper'

function CodeBox({ id, code, compileCode, lang, isLive, scopes }) {
  return (
    <LiveProvider key={id} code={code} compileCode={compileCode} language={lang} scope={scopes}>
      <Wrapper isLive={isLive} />
    </LiveProvider>
  )
}

const Output = (props) => {
  useEffect(() => {
    const dom = document.getElementById(props.id)
    ReactDOM.render(<CodeBox {...props} />, dom)
  }, [props])

  return null
}

export default Output

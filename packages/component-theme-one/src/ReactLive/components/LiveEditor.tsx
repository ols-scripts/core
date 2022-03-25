import React, { Fragment, useEffect, useState, useContext, useCallback } from 'react'
import Editor from 'react-simple-code-editor'
import Highlight, { Prism } from 'prism-react-renderer'
import LiveContext from './LiveContext'
import liveTheme from '../constants/theme'

export default function LiveEditor(props) {
  const { code, language, theme, onChange } = useContext<any>(LiveContext)
  const { style, ...rest } = props

  const [state, setState] = useState<any>({
    code: code || '',
  })

  useEffect(() => {
    if (state.prevCodeProp && code !== state.prevCodeProp) {
      setState({ code, prevCodeProp: code })
    }
  }, [code])

  const updateContent = useCallback((newCode) => {
    setState({ code: newCode })
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(state.code)
    }
  }, [state.code])

  const highlightCode = useCallback(
    (_code) => (
      <Highlight Prism={Prism} code={_code} theme={theme || liveTheme} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </>
        )}
      </Highlight>
    ),
    [theme, language],
  )

  const baseTheme = theme && typeof theme.plain === 'object' ? theme.plain : {}

  return (
    <Editor
      value={state.code}
      padding={10}
      highlight={highlightCode}
      onValueChange={updateContent}
      style={{
        whiteSpace: 'pre',
        fontFamily: 'monospace',
        ...baseTheme,
        ...style,
      }}
      {...rest}
    />
  )
}

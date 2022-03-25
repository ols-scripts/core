import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import LiveContext from './LiveContext'
import DefaultTheme from '../constants/theme'

function LiveProvider({
  children,
  code = '',
  compileCode = '',
  language = 'jsx',
  theme = DefaultTheme,
  scope,
}) {
  const [state, setState] = useState<{ error?: string; element?: any }>({
    error: '',
    element: undefined,
  })

  const onError = (error) => setState({ error: error.toString() })

  return (
    <LiveContext.Provider
      value={{
        ...state,
        code,
        compileCode,
        scope: {
          'react': React,
          'react-dom': ReactDOM,
          ...scope,
        },
        language,
        theme,
        onError,
      }}
    >
      {children}
    </LiveContext.Provider>
  )
}

export default LiveProvider

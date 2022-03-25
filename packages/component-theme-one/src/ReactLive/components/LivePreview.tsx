import React, { useCallback, useContext, useEffect, useRef } from 'react'
import LiveContext from './LiveContext'
import ErrorBoundary from './ErrorBoundary'
import evalCode from '../utils/evalCode'

function LivePreview({ ...rest }) {
  const { compileCode, scope, error, onError } = useContext<any>(LiveContext)
  const domRef = useRef()

  const run = useCallback((newCode) => {
    const codeTrimmed = newCode.trim().replace(/;$/, '')

    try {
      evalCode(codeTrimmed.trim(), scope, domRef.current)
    } catch (error) {
      onError(error)
    }
  }, [])

  useEffect(() => {
    compileCode && run(compileCode)
  }, [compileCode])

  return (
    <ErrorBoundary error={error} onError={onError}>
      <div {...rest} ref={domRef} />
    </ErrorBoundary>
  )
}

export default LivePreview

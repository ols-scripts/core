import React, { useState, useCallback } from 'react'
import { LiveEditor, LivePreview } from '../ReactLive'
import './index.less'

export default function Wrapper({ isLive }) {
  const [visible, setVisible] = useState(true)

  const onExpand = useCallback(() => {
    setVisible(!visible)
  }, [visible])

  if (!isLive) {
    return <LiveEditor className="ols-theme-one-playgroundEditor" />
  }

  return (
    <div className="ols-theme-one-wrapper">
      <div className="ols-theme-one-playgroundPreview">
        <LivePreview />
      </div>
      <div className="ols-theme-one-operate">
        <span onClick={onExpand} className="ols-theme-one-operateItem">
          {visible ? '收起' : '展开'}
        </span>
      </div>
      <LiveEditor style={{ height: visible ? 'auto' : 0 }} className="ols-theme-one-playgroundEditor" />
    </div>
  )
}

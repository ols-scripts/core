import { Layout } from 'antd'
import React from 'react'
import './index.less'

const { Content } = Layout

interface IProps {
  children?: React.ReactElement
}

const BgContent = (props: IProps) => {
  const { children } = props

  return (
    <Content className="ols-theme-one-content-wrapper">
      <div className="ols-theme-one-main-content">{children}</div>
    </Content>
  )
}

export default BgContent

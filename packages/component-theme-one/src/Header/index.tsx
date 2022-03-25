import { Layout } from 'antd'
import React, { useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'

const { Header } = Layout

type HeaderProps = Record<string, any>

const BgHeader = (props: HeaderProps) => {
  const { history } = props

  const linkToHomePage = useCallback(() => {
    history.push('/')
  }, [history])

  return (
    <Header>
      <div className="flex-around-center">
        <div className="ols-theme-one-logo flex-start-center" onClick={linkToHomePage}>
          <span className="ols-theme-platform-name">OLS组件调试</span>
        </div>
      </div>
    </Header>
  )
}

export default withRouter(BgHeader)

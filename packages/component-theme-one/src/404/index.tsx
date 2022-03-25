import React, { FC } from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'

const PageNotFound: FC<any> = ({ history }) => {
  const linkToHomePage = () => {
    history.push('/')
  }
  const refreshPage = () => {
    window.location.reload()
  }

  return (
    <div className="ols-theme-one-not-found-wrapper">
      <p>对不起，您访问的页面已被删除或不存在</p>
      <div>
        <Button type="primary" onClick={linkToHomePage}>
          首页
        </Button>
        <Button className="ols-theme-one-refresh-button" onClick={refreshPage}>
          刷新
        </Button>
      </div>
    </div>
  )
}

export default withRouter(PageNotFound)

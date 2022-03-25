import React, { FC } from 'react'
import { Layout } from 'antd'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import PageNotFound from './404'
import Content from './Content'
import Header from './Header'
import Sider from './Sider'
import MdBox from './MdBox'

import 'antd/dist/antd.css'
import './index.less'

type IProps = {
  routes: Array<{
    link: string
    title: string
    component: any
  }>
  scopes: Record<string, any>
}

const App: FC<IProps> = ({ routes = [], scopes }) => {
  const style = { height: 'calc(100vh - 64px)' }
  return (
    <Router>
      <Layout>
        <Header />
        <Layout style={style} className="ols-theme-one-layout-wrap">
          <Sider menus={routes} />
          <Switch>
            {routes.map((item) => {
              const { link, title, component = {} } = item

              return (
                <Route
                  exact
                  key={link}
                  path={link}
                  render={(props) => {
                    return (
                      <Content name={title} {...props}>
                        <MdBox {...component} scopes={scopes} />
                      </Content>
                    )
                  }}
                />
              )
            })}
            {routes.length && (
              <Route exact path="/">
                <Redirect to={routes[0].link} />
              </Route>
            )}
            <Route component={PageNotFound} />
          </Switch>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App

import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import Theme from '@ols-scripts/component-theme-one'
import { routes, scopes } from './markdownData'

const App: FC = () => {
  return <Theme routes={routes} scopes={scopes} />
}

ReactDOM.render(<App />, document.getElementById('app'))

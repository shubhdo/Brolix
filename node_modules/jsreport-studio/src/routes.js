import React from 'react'
import {IndexRoute, Route} from 'react-router'
import { rootPath } from './lib/configuration.js'
import App from './containers/App/App.js'

export default (aroutes) => {
  const routes = aroutes || []

  return (
    <Route path={rootPath} component={App}>
      <IndexRoute component={App} />
      <Route path='studio' component={App}>
        <Route path=':entitySet' component={App}>
          <Route path=':shortid' component={App} />
        </Route>
      </Route>
      {routes.map((r) => <Route path={r.path} component={r.component} key={r.path} />)}
      <Route path='*' component={App} />
    </Route>
  )
}

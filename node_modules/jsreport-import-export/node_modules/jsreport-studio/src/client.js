import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './redux/create'
import {Provider} from 'react-redux'
import { Router, browserHistory } from 'react-router'
import getRoutes from './routes'
import fetchExtensions from 'lib/fetchExtensions'
import './theme/style.scss'
import * as entities from 'redux/entities'
import * as settings from 'redux/settings'
import Promise from 'bluebird'
import * as configuration from './lib/configuration.js'
import { createStudio as createStudio } from './Studio'
import defaults from './configurationDefaults.js'
import getEntityTreeOrder from './helpers/getEntityTreeOrder'
import zipObject from 'lodash/zipObject'
import { syncHistoryWithStore } from 'react-router-redux'

window.React = React

__webpack_public_path__ = configuration.rootPath + '/studio/assets/'

defaults()

const store = createStore(browserHistory)
const history = syncHistoryWithStore(browserHistory, store)

var Studio = window.Studio = createStudio(store)

const start = async () => {
  await fetchExtensions()

  const extensionsArray = await Studio.api.get('/api/extensions')
  configuration.extensions = zipObject(extensionsArray.map((e) => e.name), extensionsArray)

  for (const key in Studio.initializeListeners) {
    await Studio.initializeListeners[key]()
  }

  // calculate EntityTree order after initializeListeners
  configuration.entityTreeOrder = getEntityTreeOrder(
    configuration.extensions['studio'].options.entityTreeOrder,
    Studio.entitySets
  )

  await Promise.all(
    [
      ...Object.keys(Studio.entitySets).map((t) => entities.actions.loadReferences(t)(store.dispatch)),
      Studio.api.get('/api/engine').then((engs) => (configuration.engines = engs)),
      Studio.api.get('/api/recipe').then((recs) => (configuration.recipes = recs)),
      settings.actions.load()(store.dispatch)
    ]
  )

  const routes = getRoutes(window.Studio.routes)

  let component = <Router history={history}>{routes}</Router>

  ReactDOM.render(
    <Provider store={store} key='provider'>
      {component}
    </Provider>,
    document.getElementById('content')
  )

  document.getElementById('loader').style.display = 'none'

  for (const key in Studio.readyListeners) {
    await Studio.readyListeners[key]()
  }
}

start()

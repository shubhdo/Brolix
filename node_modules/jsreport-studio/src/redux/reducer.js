import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import entities from './entities/reducer'
import editor from './editor/reducer'
import progress from './progress/reducer'
import settings from './settings/reducer'
import modal from './modal/reducer'

export default combineReducers({
  routing: routerReducer,
  entities,
  editor,
  progress,
  settings,
  modal
})

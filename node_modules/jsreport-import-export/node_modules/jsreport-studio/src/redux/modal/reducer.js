import * as ActionTypes from './constants.js'
import * as EntityActionTypes from '../entities/constants.js'
import createReducer from '../createReducer.js'

const reducer = createReducer({
  text: null,
  isOpen: false,
  componentKey: null,
  options: null
})
export default reducer.export()

reducer.handleAction(ActionTypes.OPEN, (state, { text, componentKey, options }) => ({
  ...state,
  isOpen: true,
  text: text,
  componentKey: componentKey,
  options: options
}))

reducer.handleAction(ActionTypes.CLOSE, (state) => ({
  ...state,
  isOpen: false,
  text: null,
  componentKey: null,
  options: null
}))

reducer.handleAction(EntityActionTypes.API_FAILED, (state, action) => ({
  ...state,
  isOpen: true,
  text: action.error.message
}))


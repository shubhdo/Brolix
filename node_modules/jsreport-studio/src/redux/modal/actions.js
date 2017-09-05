import * as ActionTypes from './constants.js'

export function openText (text) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.OPEN,
      text: text
    })
  }
}

export const openComponent = (componentKey, options) => ({
  type: ActionTypes.OPEN,
  componentKey: componentKey,
  options: options
})

export function close () {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.CLOSE
    })
  }
}
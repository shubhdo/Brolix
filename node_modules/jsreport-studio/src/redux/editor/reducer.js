import * as ActionTypes from './constants.js'
import { ActionTypes as EntityActionTypes } from '../entities'
import createReducer from '../createReducer.js'

const reducer = createReducer({
  tabs: [],
  activeTabKey: null,
  lastActiveTemplateKey: null,
  undockMode: false
})
export default reducer.export()

reducer.handleAction(ActionTypes.OPEN_TAB, (state, { tab }) => ({
  ...state,
  tabs: state.tabs.filter((t) => t.key === tab.key).length ? state.tabs : [...state.tabs, tab]
}))

reducer.handleAction(ActionTypes.OPEN_NEW_TAB, (state, { tab }) => ({
  ...state,
  activeTabKey: tab.key,
  tabs: [...state.tabs, tab],
  lastActiveTemplateKey: (tab.entitySet === 'templates') ? tab._id : state.lastActiveTemplateKey
}))

reducer.handleActions([EntityActionTypes.REMOVE, ActionTypes.CLOSE_TAB], (state, action) => {
  let newTabs = state.tabs.filter((t) => t.key !== action.key && (!action._id || t._id !== action._id))
  let newActivatTabKey = state.activeTabKey
  if (state.activeTabKey === action.key || state.activeTabKey === action._id) {
    newActivatTabKey = newTabs.length ? newTabs[newTabs.length - 1].key : null
  }

  const newActivatTab = newActivatTabKey ? newTabs.filter((t) => t.key === newActivatTabKey)[0] : null

  return {
    ...state,
    activeTabKey: newActivatTabKey,
    tabs: newTabs,
    lastActiveTemplateKey: (newActivatTab && newActivatTab.entitySet === 'templates') ? newActivatTab._id
      : (newTabs.filter((t) => t._id === state.lastActiveTemplateKey).length ? state.lastActiveTemplateKey : null)
  }
})

reducer.handleAction(ActionTypes.ACTIVATE_TAB, (state, action) => {
  const newTab = state.tabs.filter((t) => t.key === action.key)[0]

  return {
    ...state,
    activeTabKey: action.key,
    lastActiveTemplateKey: newTab.entitySet === 'templates' ? newTab._id : state.lastActiveTemplateKey
  }
})

reducer.handleAction(EntityActionTypes.SAVE_NEW, (state, action) => {
  let indexMap = {}
  let indexes = []
  let tabs = []

  // this code is necessary to support updating header/footer templates
  let modTabs = state.tabs.filter((t, idx) => {
    const keepItem = (t._id === action.oldId)

    if (keepItem) {
      indexes.push(idx)
      indexMap[idx] = indexes.length - 1
    }

    return keepItem
  }).map((tab) => {
    return Object.assign({}, tab, {
      _id: action.entity._id,
      key: tab.key.replace(action.oldId, action.entity._id)
    })
  })

  state.tabs.forEach(function (tab, idx) {
    if (indexes.indexOf(idx) !== -1) {
      return tabs.push(modTabs[indexMap[idx]])
    }

    tabs.push(tab)
  })

  return {
    ...state,
    tabs: tabs,
    activeTabKey: (state.lastActiveTemplateKey === action.oldId || state.activeTabKey === action.oldId) ? ((
      // looking if the last activeTabKey was a header/footer tab
      state.activeTabKey.indexOf(state.lastActiveTemplateKey) === 0 && state.activeTabKey !== state.lastActiveTemplateKey
    ) ? state.activeTabKey.replace(action.oldId, action.entity._id) : action.entity._id) : state.activeTabKey,
    lastActiveTemplateKey: state.lastActiveTemplateKey === action.oldId ? action.entity._id : state.lastActiveTemplateKey
  }
})

reducer.handleAction(EntityActionTypes.REPLACE, (state, action) => {
  if (!state.tabs.filter((t) => t._id === action.oldId).length) {
    return state
  }

  const tabs = state.tabs.map((t) => {
    if (t._id !== action.oldId) {
      return Object.assign({}, t)
    }

    return Object.assign({}, t, {
      _id: action.entity._id,
      key: t.key.replace(action.oldId, action.entity._id)
    })
  })

  return {
    ...state,
    tabs: tabs,
    activeTabKey: (state.activeTabKey && state.activeTabKey.indexOf(action.oldId) === 0) ? state.activeTabKey.replace(action.oldId, action.entity._id) : state.activeTabKey,
    lastActiveTemplateKey: state.lastActiveTemplateKey === action.oldId ? action.entity._id : state.lastActiveTemplateKey
  }
})

reducer.handleAction(ActionTypes.ACTIVATE_UNDOCK_MODE, (state, action) => {
  return {
    ...state,
    undockMode: true
  }
})

reducer.handleAction(ActionTypes.DESACTIVATE_UNDOCK_MODE, (state, action) => {
  return {
    ...state,
    undockMode: false
  }
})

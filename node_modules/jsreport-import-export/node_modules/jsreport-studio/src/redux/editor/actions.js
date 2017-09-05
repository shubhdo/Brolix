import * as entities from '../entities'
import * as ActionTypes from './constants.js'
import uid from '../../helpers/uid.js'
import * as selectors from './selectors.js'
import { push } from 'react-router-redux'
import shortid from 'shortid'
import preview from '../../helpers/preview'
import resolveUrl from '../../helpers/resolveUrl.js'
import beautify from 'js-beautify'
import { engines, recipes, entitySets, previewListeners, locationResolver, editorComponents } from '../../lib/configuration.js'

export function closeTab (id) {
  return (dispatch, getState) => {
    const activeEntity = selectors.getActiveEntity(getState())

    dispatch({
      type: ActionTypes.CLOSE_TAB,
      key: id
    })

    if (activeEntity && activeEntity._id === id) {
      dispatch(entities.actions.unload(id))
    }
  }
}

export function openTab (tab) {
  return async function (dispatch, getState) {
    if (tab.shortid && !tab._id) {
      try {
        tab._id = entities.selectors.getByShortid(getState(), tab.shortid)._id
      } catch (e) {
        dispatch(push(resolveUrl('/')))
        return
      }
    }

    if (tab._id) {
      await entities.actions.load(tab._id)(dispatch, getState)
      tab.entitySet = entities.selectors.getById(getState(), tab._id).__entitySet
    }

    tab.type = tab._id ? 'entity' : 'custom'
    tab.key = tab.key || tab._id

    dispatch({
      type: ActionTypes.OPEN_TAB,
      tab: tab
    })

    dispatch(activateTab(tab.key))
  }
}

export function openNewTab ({ entitySet, name }) {
  return (dispatch) => {
    let id = uid()
    let entity = {
      _id: id,
      __entitySet: entitySet,
      shortid: shortid.generate(),
      [entitySets[entitySet].nameAttribute]: name
    }

    if (entitySet === 'templates') {
      entity.recipe = recipes.includes('phantom-pdf') ? 'phantom-pdf' : recipes[0]
      entity.engine = engines.includes('handlebars') ? 'handlebars' : engines[0]
    }

    dispatch(entities.actions.add(entity))
    dispatch({
      type: ActionTypes.OPEN_NEW_TAB,
      tab: {
        _id: id,
        key: id,
        entitySet: entitySet,
        type: 'entity'
      }
    })
  }
}

export function activateTab (id) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.ACTIVATE_TAB,
      key: id
    })
  }
}

export function updateHistory () {
  return (dispatch, getState) => {
    const entity = selectors.getActiveEntity(getState())
    let path

    if (entity && entity.shortid) {
      path = resolveUrl(`/studio/${entity.__entitySet}/${entity.shortid}`)
    } else {
      path = resolveUrl('/')
    }

    if (locationResolver) {
      path = locationResolver(path, entity)
    }

    if (path !== getState().routing.locationBeforeTransitions.pathname) {
      dispatch(push(path))
    }
  }
}

export function update (entity) {
  return async function (dispatch, getState) {
    await entities.actions.update(entity)(dispatch, getState)
  }
}

export function groupedUpdate (entity) {
  return async function (dispatch, getState) {
    await entities.actions.groupedUpdate(entity)(dispatch, getState)
  }
}

export function save () {
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: ActionTypes.SAVE_STARTED
      })
      await entities.actions.save(selectors.getActiveTab(getState())._id)(dispatch, getState)
      dispatch({
        type: ActionTypes.SAVE_SUCCESS
      })
    } catch (e) {
      console.error(e)
    }
  }
}

export function saveAll () {
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: ActionTypes.SAVE_STARTED
      })

      await Promise.all(getState().editor.tabs.filter((t) => t.type === 'entity' && t.headerOrFooter == null).map((t) => entities.actions.save(t._id)(dispatch, getState)))

      dispatch({
        type: ActionTypes.SAVE_SUCCESS
      })
    } catch (e) {
      console.error(e)
    }
  }
}

const reformatter = function (code, mode) {
  return beautify[mode](code || '', {
    unformatted: ['script']
  })
}

export function reformat () {
  return async function (dispatch, getState) {
    try {
      // this flushed the updates
      dispatch(entities.actions.flushUpdates())

      const tab = selectors.getActiveTab(getState())

      const editorReformat = editorComponents[tab.editorComponentKey || tab.entitySet].reformat

      const activeEntity = selectors.getActiveEntity(getState())
      const toUpdate = editorReformat(reformatter, activeEntity, tab)

      dispatch(update(Object.assign({ _id: activeEntity._id }, toUpdate)))
    } catch (e) {
      console.error(e)
    }
  }
}

export function remove () {
  return async function (dispatch, getState) {
    const tab = selectors.getActiveTab(getState())
    await dispatch(entities.actions.remove(tab._id))
  }
}

export function run (target) {
  return async function (dispatch, getState) {
    let template = Object.assign({}, selectors.getLastActiveTemplate(getState()))
    let request = { template: template, options: {} }
    const entities = Object.assign({}, getState().entities)
    await Promise.all([...previewListeners.map((l) => l(request, entities, target))])
    dispatch({ type: ActionTypes.RUN })

    preview(request, target || 'previewFrame')
  }
}

export function activateUndockMode () {
  return {
    type: ActionTypes.ACTIVATE_UNDOCK_MODE
  }
}

export function desactivateUndockMode () {
  return {
    type: ActionTypes.DESACTIVATE_UNDOCK_MODE
  }
}

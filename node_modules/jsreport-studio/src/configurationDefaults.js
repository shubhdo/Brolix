import { connect } from 'react-redux'
import * as configuration from './lib/configuration.js'
import TemplateProperties from './components/Properties/TemplateProperties.js'
import EntityTree from './components/EntityTree/EntityTree.js'
import EntityTreeInputSearch from './components/EntityTree/EntityTreeInputSearch.js'
import Startup from './containers/Startup/Startup.js'
import ApiModal from './components/Modals/ApiModal.js'
import { openTab } from './redux/editor/actions'

export default () => {
  configuration.propertiesComponents.push({
    title: TemplateProperties.title,
    shouldDisplay: (entity) => entity.__entitySet === 'templates',
    component: TemplateProperties
  })

  configuration.editorComponents.templates = require('./components/Editor/TemplateEditor.js')
  configuration.editorComponents.templates.reformat = (reformatter, entity) => {
    const content = reformatter(entity.content, 'html')
    const helpers = reformatter(entity.helpers, 'js')

    return {
      content: content,
      helpers: helpers
    }
  }
  configuration.editorComponents.startup = Startup
  configuration.entitySets.templates = {
    name: 'templates',
    visibleName: 'template',
    nameAttribute: 'name',
    referenceAttributes: ['name', 'recipe', 'shortid'],
    entityTreePosition: 1000
  }

  configuration.sharedComponents.EntityTree = EntityTree

  configuration.apiSpecs = {
    template: {
      content: '...',
      helpers: '...',
      engine: '...',
      recipe: '...'
    },
    data: {
      aProperty: '...'
    },
    options: {}
  }

  // default filter by name strategy
  configuration.entityTreeFilterItemResolvers.push((entity, entitySets, filterInfo) => {
    const { name } = filterInfo

    if (name == null || name === '') {
      return true
    }

    const entityName = entitySets[entity.__entitySet].nameAttribute ? entity[entitySets[entity.__entitySet].nameAttribute] : entity.name

    return entityName.indexOf(name) !== -1
  })

  configuration.entityTreeToolbarComponents.push((props) => (
    <EntityTreeInputSearch {...props} />
  ))

  configuration.toolbarComponents.settings.push(connect(
    undefined,
    { openTab }
  )((props) => (
    <div
      onClick={() => props.openTab({ key: 'StartupPage', editorComponentKey: 'startup', title: 'Startup' })}>
      <i className='fa fa-home'></i> Startup page
    </div>
  )))

  configuration.toolbarComponents.settings.push(() => (
    <div
      onClick={() => configuration.modalHandler.open(ApiModal, { apiSpecs: configuration.apiSpecs })}>
      <i className='fa fa-plug'></i> API
    </div>
  ))

  configuration.initializeListeners.push(() => {
    configuration.entityTreeIconResolvers.push((entity) => {
      if (entity.__entitySet !== 'templates') {
        return
      }

      if (entity.recipe === 'html') {
        return 'fa-html5'
      }

      if (entity.recipe.indexOf('xlsx') !== -1) {
        return 'fa-table'
      }

      if (entity.recipe.indexOf('pdf') !== -1) {
        return 'fa-file-pdf-o'
      }

      if (entity.recipe.indexOf('html') !== -1) {
        return 'fa-html5'
      }
    })
  })
}

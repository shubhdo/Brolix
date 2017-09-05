import Studio from 'jsreport-studio'
import NewTagModal from './NewTagModal'
import TagEditor from './TagEditor'
import TagProperties from './TagProperties'
import EntityTagProperties from './EntityTagProperties'
import EntityTreeTagOrganizer from './EntityTreeTagOrganizer'
import TagEntityTreeToolbar from './TagEntityTreeToolbar'
import TagEntityTreeItem from './TagEntityTreeItem'
import TagEntityTreeTagGroupItem from './TagEntityTreeTagGroupItem'
import filterItemWithTagsStrategy from './filterItemWithTagsStrategy'

Studio.addEntitySet({
  name: 'tags',
  faIcon: 'fa-tag',
  visibleName: 'tag',
  onNew: () => Studio.openModal(NewTagModal),
  helpUrl: 'http://jsreport.net/learn/tags',
  referenceAttributes: ['color'],
  entityTreePosition: 300
})

// wait for all extensions to be loaded
Studio.initializeListeners.push(() => {
  // add tags to referenceAttributes in all entities
  Object.keys(Studio.entitySets).forEach((entitySetName) => {
    let entitySet = Studio.entitySets[entitySetName]

    // ignore tags entity set
    if (entitySet.name === 'tags') {
      return
    }

    if (entitySet.referenceAttributes.indexOf('tags') === -1) {
      entitySet.referenceAttributes.push('tags')
    }
  })
})

Studio.addEditorComponent('tags', TagEditor)
Studio.addPropertiesComponent(TagProperties.title, TagProperties, (entity) => entity.__entitySet === 'tags')
Studio.addPropertiesComponent(EntityTagProperties.title, EntityTagProperties, (entity) => entity.__entitySet !== 'tags')

Studio.addEntityTreeWrapperComponent(EntityTreeTagOrganizer)
Studio.addEntityTreeToolbarComponent(TagEntityTreeToolbar)
Studio.addEntityTreeItemComponent(TagEntityTreeItem)
Studio.addEntityTreeItemComponent(TagEntityTreeTagGroupItem, 'groupRight')

Studio.entityTreeFilterItemResolvers.push(filterItemWithTagsStrategy)

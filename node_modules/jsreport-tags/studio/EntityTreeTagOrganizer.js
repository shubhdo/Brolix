import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import emitter from './emitter'
import findTagInSet from './findTagInSet'

const { default: reservedTagNames, noTagGroupName, tagsGroupName } = require('../shared/reservedTagNames')

const specialGroups = reservedTagNames

class EntityTreeTagOrganizer extends Component {
  constructor () {
    super()

    let organizeByDefault = Studio.extensions['tags'].options.organizeByDefault

    if (organizeByDefault == null) {
      organizeByDefault = false
    }

    this.state = {
      organizeByTags: organizeByDefault
    }

    this.onOrganizationModeChange = this.onOrganizationModeChange.bind(this)
  }

  componentDidMount () {
    emitter.on('organizationModeByTagsChanged', this.onOrganizationModeChange)
  }

  componentWillUnmount () {
    emitter.off('organizationModeByTagsChanged', this.onOrganizationModeChange)
  }

  onOrganizationModeChange (organizeByTag) {
    this.setState({
      organizeByTags: organizeByTag
    })
  }

  addToGroups (groups, tagName) {
    if (groups.indexOf(tagName) === -1) {
      groups.push(tagName)
    }
  }

  addToGroupsWithData (groups, tagName) {
    if (groups.indexOf(tagName) === -1) {
      groups.push(tagName)
    }
  }

  addToEntitiesByTag (collection, initializeSets, tagName, groupData, entity, noGroup) {
    let collectionItem
    let collectionItemEntitiesSet
    let dataInGroup = groupData || {}

    // initialize collection item if not present
    if (collection[tagName] == null) {
      if (noGroup) {
        collection[tagName] = []
      } else {
        collection[tagName] = {
          __hasChildEntitiesSet__: true,
          entitiesSet: {},
          data: {
            name: tagName,
            ...dataInGroup
          }
        }

        if (initializeSets) {
          initializeSets.forEach((nameOfSet) => {
            // ignore tags set for groups
            if (nameOfSet === 'tags') {
              return
            }

            collection[tagName].entitiesSet[nameOfSet] = []
          })
        }
      }
    }

    collectionItem = collection[tagName]

    if (noGroup) {
      if (entity) {
        collectionItem.push(entity)
      }
      return
    }

    if (!entity) {
      return
    }

    if (collectionItem.entitiesSet[entity.__entitySet] == null) {
      collectionItem.entitiesSet[entity.__entitySet] = []
    }

    collectionItemEntitiesSet = collectionItem.entitiesSet[entity.__entitySet]

    collectionItemEntitiesSet.push(entity)
  }

  groupEntitiesByTag (entitySets, entities) {
    let groups = []
    let newEntities = {}
    let entitySetsNames = Object.keys(entitySets)
    let allTagEntities = Studio.getReferences().tags || []
    let groupsWithData = []

    // initialize all tag groups based on all tag entities
    allTagEntities.forEach((entityTag) => {
      const tagInfo = findTagInSet(allTagEntities, entityTag.shortid)

      this.addToEntitiesByTag(newEntities, entitySetsNames, tagInfo.name, {
        shortid: tagInfo.shortid,
        color: tagInfo.color,
        groupType: 'tags'
      }, undefined)
    })

    // initialize special groups
    specialGroups.forEach((specialGroupName) => {
      let noGroup = false

      if (specialGroupName === tagsGroupName) {
        noGroup = true
      }

      this.addToEntitiesByTag(newEntities, entitySetsNames, specialGroupName, undefined, undefined, noGroup)
    })

    entitySetsNames.forEach((entitySetName) => {
      const entitiesInSet = entities[entitySetName]

      if (!entitiesInSet) {
        return
      }

      let entitiesInSetCount = entitiesInSet.length

      for (let j = 0; j < entitiesInSetCount; j++) {
        const entity = entitiesInSet[j]

        if (entitySetName === 'tags') {
          // special groups are added to groups array at the end of the function
          this.addToEntitiesByTag(newEntities, entitySetsNames, tagsGroupName, undefined, entity, true)
          continue
        }

        if (!Array.isArray(entity.tags) || entity.tags.length === 0) {
          // special groups are added to groups array at the end of the function
          this.addToEntitiesByTag(newEntities, entitySetsNames, noTagGroupName, undefined, entity)
          continue
        }

        let tagsCount = entity.tags.length

        for (let k = 0; k < tagsCount; k++) {
          const entityTag = entity.tags[k]
          const tagInfo = findTagInSet(allTagEntities, entityTag.shortid)

          if (!tagInfo) {
            continue
          }

          this.addToGroups(groups, tagInfo.name)
          this.addToGroupsWithData(groupsWithData, tagInfo.name)
          this.addToEntitiesByTag(newEntities, entitySetsNames, tagInfo.name, undefined, entity)
        }
      }
    })

    // empty groups should be inserted in the end of groups array (before special groups)
    // (it should be inserted to allow its visualization in tree)
    allTagEntities.forEach((entityTag) => {
      if (groupsWithData.indexOf(entityTag.name) === -1) {
        this.addToGroups(groups, entityTag.name)
      }
    })

    // special groups should be placed in the end of groups
    specialGroups.forEach((gname) => {
      this.addToGroups(groups, gname)
    })

    return {
      groups,
      entitiesByTag: newEntities
    }
  }

  render () {
    const { containerStyles } = this.props

    return (
      <div style={containerStyles}>
        {/*
          extending entity tree's react element to configure
          custom rendering of items in tree
        */}
        {React.cloneElement(this.props.children, {}, ({
          renderClassicTree,
          renderObjectSubTree,
          entitySets,
          entities
        }) => {
          const { organizeByTags } = this.state

          if (!organizeByTags) {
            return renderClassicTree(entitySets, entities)
          }

          let { groups, entitiesByTag } = this.groupEntitiesByTag(entitySets, entities)

          return groups.map((groupName) => {
            return renderObjectSubTree(groupName, entitiesByTag[groupName] || [])
          })
        })}
      </div>
    )
  }
}

export default EntityTreeTagOrganizer

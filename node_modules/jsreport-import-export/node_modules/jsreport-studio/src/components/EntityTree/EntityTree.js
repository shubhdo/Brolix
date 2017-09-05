import React, {Component} from 'react'
import ReactList from 'react-list'
import style from './EntityTree.scss'
import {
  entitySets,
  entityTreeOrder,
  entityTreeToolbarComponents,
  entityTreeItemComponents,
  entityTreeFilterItemResolvers,
  entityTreeIconResolvers
} from '../../lib/configuration.js'

export default class EntityTree extends Component {
  static propTypes = {
    entities: React.PropTypes.object.isRequired,
    activeEntity: React.PropTypes.object,
    // specifies if the tree should render a toolbar in his header
    toolbar: React.PropTypes.bool,
    // specifies that the tree is in selectable mode,
    // in this mode, filtering is disabled, all items (incluiding in subtrees)
    // have a checkbox for single or multiple selection and contextmenu actions are disabled
    selectable: React.PropTypes.bool,
    // tree accepts a render callback (function as child) to allow extensions to
    // control how entity items are rendered
    children: React.PropTypes.func
    // onClick: React.PropTypes.func.isRequired,
    // onRemove: React.PropTypes.func.isRequired,
    // onRename: React.PropTypes.func.isRequired,
    // onNewClick: React.PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = { filter: {} }
    this.setFilter = this.setFilter.bind(this)
    this.renderClassicTree = this.renderClassicTree.bind(this)
    this.renderObjectSubTree = this.renderObjectSubTree.bind(this)
  }

  componentDidMount () {
    window.addEventListener('click', () => this.tryHide())
  }

  componentWillUnmount () {
    window.removeEventListener('click', () => this.tryHide())
  }

  createRenderer (entities) {
    return (index, key) => this.renderNode(entities[index])
  }

  tryHide () {
    if (this.state.contextMenuId) {
      this.setState({ contextMenuId: null })
    }
  }

  contextMenu (e, entity) {
    e.preventDefault()
    this.setState({ contextMenuId: entity._id })
  }

  collapse (k) {
    this.setState({ [k]: !this.state[k] })
  }

  filterEntities (entities) {
    const filterInfo = this.state.filter
    let result = {}

    const allFiltersAreEmpty = Object.keys(filterInfo).every((filterKey) => {
      const filterValue = filterInfo[filterKey]

      if (Array.isArray(filterValue)) {
        return filterValue.length === 0
      }

      return (filterValue === '' || filterValue == null)
    })

    if (allFiltersAreEmpty) {
      return entities
    }

    Object.keys(entities).forEach((k) => {
      result[k] = entities[k].filter((entity) => {
        return entityTreeFilterItemResolvers.every((filterResolver) => {
          const filterResult = filterResolver(entity, entitySets, filterInfo)

          if (typeof filterResult !== 'boolean') {
            throw new Error('filterItemResolver must return boolean values, invalid return found in resolvers')
          }

          return filterResult
        })
      })
    })

    return result
  }

  setFilter (newFilterState) {
    this.setState((prevState) => {
      return {
        filter: {
          ...prevState.filter,
          ...newFilterState
        }
      }
    })
  }

  getSetsToRender (sets) {
    const setsNames = Object.keys(sets)
    let setsInOrderSpecification = []

    const setsNotInOrderSpecification = setsNames.filter((setName) => {
      const indexInOrder = entityTreeOrder.indexOf(setName)
      const found = indexInOrder !== -1

      if (found) {
        // make sure to only add set names present in sets
        setsInOrderSpecification.push({
          idx: indexInOrder,
          name: setName
        })
      }

      return !found
    })

    setsInOrderSpecification = setsInOrderSpecification.sort((a, b) => {
      if (a.idx > b.idx) {
        return 1
      }

      if (a.idx < b.idx) {
        return -1
      }

      return 0
    }).map((setInfo) => setInfo.name)

    return [...setsInOrderSpecification, ...setsNotInOrderSpecification]
  }

  resolveEntityTreeIconStyle (entity) {
    for (const k in entityTreeIconResolvers) {
      const mode = entityTreeIconResolvers[k](entity)
      if (mode) {
        return mode
      }
    }

    return null
  }

  renderContextMenu (entity) {
    const { onRemove, onRename } = this.props

    return <div key='entity-contextmenu' className={style.contextMenuContainer}>
      <div className={style.contextMenu}>
        <div
          className={style.contextButton}
          onClick={(e) => { e.stopPropagation(); onRename(entity._id); this.tryHide() }}>
          <i className='fa fa-pencil' /> Rename
        </div>
        <div
          className={style.contextButton}
          onClick={(e) => { e.stopPropagation(); onRemove(entity._id); this.tryHide() }}>
          <i className='fa fa-trash' /> Delete
        </div>
      </div>
    </div>
  }

  renderEntityTreeItemComponents (position, propsToItem, originalChildren) {
    if (position === 'container') {
      // if there are no components registered, defaults to original children
      if (!entityTreeItemComponents[position].length) {
        return originalChildren
      }

      // composing components when position is container
      const wrappedItemElement = entityTreeItemComponents[position].reduce((prevElement, b) => {
        if (prevElement == null) {
          return React.createElement(b, propsToItem, originalChildren)
        }

        return React.createElement(b, propsToItem, prevElement)
      }, null)

      if (!wrappedItemElement) {
        return null
      }

      return wrappedItemElement
    }

    return entityTreeItemComponents[position].map((p, i) => (
      React.createElement(p, {
        key: i,
        ...propsToItem
      }))
    )
  }

  renderNode (entity) {
    const { activeEntity, onSelect, onClick, selectable, entities: originalEntities } = this.props
    const { contextMenuId } = this.state

    const entityStyle = this.resolveEntityTreeIconStyle(entity)

    return (
      <div
        onContextMenu={(e) => this.contextMenu(e, entity)}
        onClick={() => selectable ? onSelect(entity) : onClick(entity._id)}
        key={entity._id}
        className={style.link + ' ' + ((activeEntity && entity._id === activeEntity._id) ? style.active : '')}
      >
        {this.renderEntityTreeItemComponents('container', { entity, entities: originalEntities }, [
          selectable ? <input key='search-name' type='checkbox' readOnly checked={entity.__selected !== false} /> : <span key='empty-search-name' />,
          <i key='entity-icon' className={style.entityIcon + ' fa ' + (entityStyle || (entitySets[entity.__entitySet].faIcon || style.entityDefaultIcon))}></i>,
          <a key='entity-name'>{entity[entitySets[entity.__entitySet].nameAttribute] + (entity.__isDirty ? '*' : '')}</a>,
          this.renderEntityTreeItemComponents('right', { entity, entities: originalEntities }),
          !selectable && contextMenuId === entity._id ? this.renderContextMenu(entity) : <div key='empty-contextmenu' />
        ])}
      </div>
    )
  }

  renderObjectSubTree (entitiesType, entities, depth, entitiesTypeId) {
    const { onNodeSelect, selectable } = this.props
    let treeDepth = depth || 0
    let isGroup = false
    let groupProps = {}

    if (entitiesTypeId == null) {
      entitiesTypeId = entitiesType
    }

    if (treeDepth <= 0) {
      treeDepth = 0
    }

    if (!Array.isArray(entities) && entities.__hasChildEntitiesSet__) {
      isGroup = true
      entitiesTypeId += '--group'

      if (entities.data != null) {
        groupProps = entities.data
      }
    }

    return (
      <div
        key={entitiesType}
        className={style.nodeBox}
        style={{ marginLeft: `${treeDepth * 0.8}rem` }}
      >
        {selectable ? <input type='checkbox' defaultChecked onChange={(v) => onNodeSelect(entitiesType, !!v.target.checked)} /> : <span />}
        <span
          className={style.nodeTitle + ' ' + (this.state[entitiesTypeId] ? style.collapsed : '')}
          onClick={() => this.collapse(entitiesTypeId)}
        >
          {entitiesType}
        </span>
        {isGroup && this.renderEntityTreeItemComponents('groupRight', groupProps, undefined)}
        {
          isGroup ? <span /> : (
            !this.props.selectable ? <a key={entitiesTypeId + 'new'} onClick={() => this.props.onNewClick(entitiesType)} className={style.add}></a> : <span />
          )
        }
        <div className={style.nodeContainer + ' ' + (this.state[entitiesTypeId] ? style.collapsed : '')}>
          {
            isGroup ? (
              <div>
                {
                  this.getSetsToRender(entities.entitiesSet || {}).map((entityType) => {
                    return this.renderObjectSubTree(
                      entityType,
                      entities.entitiesSet[entityType],
                      treeDepth + 1,
                      `${entitiesTypeId}--${entityType}`
                    )
                  })
                }
              </div>
            ) : (
              <ReactList itemRenderer={this.createRenderer(entities)} length={entities.length} />
            )
          }
        </div>
      </div>
    )
  }

  renderClassicTree (sets, entitiesByType) {
    const setsToRender = this.getSetsToRender(sets)

    return setsToRender.map((entitiesType) => {
      return this.renderObjectSubTree(entitiesType, entitiesByType[entitiesType] || [])
    })
  }

  renderEntityTreeToolbarComponents () {
    return entityTreeToolbarComponents.map((p, i) => (
      React.createElement(p, {
        key: i,
        setFilter: this.setFilter
      })
    ))
  }

  render () {
    const entities = this.filterEntities(this.props.entities)
    const children = this.props.children

    return (
      <div className={style.treeListContainer}>
        {
          this.props.toolbar && entityTreeToolbarComponents.length > 0 && (
            <div className={style.toolbar}>
              {this.renderEntityTreeToolbarComponents()}
            </div>
          )
        }
        <div className={style.nodesBox}>
          {/*
            When a render callback (function as child) is passed it means that an extension
            wants to control how entity tree is rendered and we should pass all useful
            information to the callback
          */}
          {
            typeof children === 'function' ? children({
              renderClassicTree: this.renderClassicTree,
              renderObjectSubTree: this.renderObjectSubTree,
              entitySets,
              entities
            }) : (
              this.renderClassicTree(entitySets, entities)
            )
          }
        </div>
      </div>
    )
  }
}

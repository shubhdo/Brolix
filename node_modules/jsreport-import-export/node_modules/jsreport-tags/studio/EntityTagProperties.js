import React, { Component } from 'react'
import ShowColor from './ShowColor'

const selectValues = (event, atags) => {
  const el = event.target

  let tags = Object.assign([], atags)

  for (var i = 0; i < el.options.length; i++) {
    if (el.options[i].selected) {
      if (!tags.filter((t) => t.shortid === el.options[i].value).length) {
        tags.push({ shortid: el.options[i].value })
      }
    } else {
      if (tags.filter((t) => t.shortid === el.options[i].value).length) {
        tags = tags.filter((t) => t.shortid !== el.options[i].value)
      }
    }
  }

  return tags
}

export default class EntityTagProperties extends Component {
  static getSelectedTags (entity, entities) {
    const getNameAndColor = (t) => {
      const foundTags = Object.keys(entities).map((k) => entities[k]).filter((tg) => tg.shortid === t.shortid)

      return foundTags.length ? { name: foundTags[0].name, color: foundTags[0].color } : { name: '', color: undefined }
    }

    return (entity.tags || []).map((t) => ({
      ...t,
      ...getNameAndColor(t)
    }))
  }

  static title (entity, entities) {
    if (!entity.tags || !entity.tags.length) {
      return 'tags'
    }

    return (
      <span>
        tags:&nbsp;
        <span>
          {
            EntityTagProperties.getSelectedTags(entity, entities).map((t, tIndex, allSelectTags) => {
              return (
                <span key={t.name} style={{ display: 'inline-block', marginRight: '2px' }}>
                  <ShowColor color={t.color} width={12} height={15} />
                  &nbsp;
                  {t.name}
                  {tIndex === allSelectTags.length - 1 ? '' : ','}
                </span>
              )
            })
          }
        </span>
      </span>
    )
  }

  componentDidMount () {
    this.removeInvalidTagReferences()
  }

  componentDidUpdate () {
    this.removeInvalidTagReferences()
  }

  selectTags (entities) {
    return Object.keys(entities).filter((k) => entities[k].__entitySet === 'tags').map((k) => entities[k])
  }

  removeInvalidTagReferences () {
    const { entity, entities, onChange } = this.props

    if (!entity.tags) {
      return
    }

    const updatedTags = entity.tags.filter((t) => Object.keys(entities).filter((k) => entities[k].__entitySet === 'tags' && entities[k].shortid === t.shortid).length)

    if (updatedTags.length !== entity.tags.length) {
      onChange({ _id: entity._id, tags: updatedTags })
    }
  }

  render () {
    const { entity, entities, onChange } = this.props
    const tags = this.selectTags(entities)

    return (
      <div className='properties-section'>
        <div className='form-group'>
          <select
            title='Use CTRL to deselect item and also to select multiple options.'
            multiple
            size='7'
            value={entity.tags ? entity.tags.map((t) => t.shortid) : []}
            onChange={(v) => onChange({_id: entity._id, tags: selectValues(v, entity.tags)})}>
            {tags.map((t) => <option key={t.shortid} value={t.shortid}>{t.name}</option>)}
          </select>
        </div>
      </div>
    )
  }
}

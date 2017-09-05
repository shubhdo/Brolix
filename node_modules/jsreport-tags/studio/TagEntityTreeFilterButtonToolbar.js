import React, { Component } from 'react'
import Studio, { EntityTreeButton, Popover } from 'jsreport-studio'
import TagEntityTreeFilterByTags from './TagEntityTreeFilterByTags'

class TagEntityTreeFilterButtonToolbar extends Component {
  render () {
    const allTags = Studio.getReferences().tags

    const {
      active,
      showFilter,
      selectedTags,
      onClick,
      onTagSelectChange,
      onFilterClose
    } = this.props

    return (
      <div title='Filter entities tree by tag' style={{ display: 'inline-block', marginLeft: '0.2rem', marginRight: '0.2rem' }}>
        <EntityTreeButton active={active} onClick={onClick}>
          <span style={{ display: 'inline-block' }}>
            <i className='fa fa-filter' />
            &nbsp;
            <i className='fa fa-tag' />
          </span>
        </EntityTreeButton>
        <Popover
          open={showFilter}
          onClose={onFilterClose}
        >
          <TagEntityTreeFilterByTags
            tags={allTags}
            selectedTags={selectedTags}
            onTagSelectChange={onTagSelectChange}
            onFilterClose={onFilterClose}
          />
        </Popover>
      </div>
    )
  }
}

export default TagEntityTreeFilterButtonToolbar

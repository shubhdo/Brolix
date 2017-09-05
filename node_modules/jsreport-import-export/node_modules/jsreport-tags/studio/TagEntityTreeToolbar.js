import React, { Component } from 'react'
import Studio from 'jsreport-studio'
import emitter from './emitter'
import TagEntityTreeOrganizeButtonToolbar from './TagEntityTreeOrganizeButtonToolbar'
import TagEntityTreeFilterButtonToolbar from './TagEntityTreeFilterButtonToolbar'

class TagEntityTreeToolbar extends Component {
  constructor (props) {
    super(props)

    let organizeByDefault = Studio.extensions['tags'].options.organizeByDefault

    if (organizeByDefault == null) {
      organizeByDefault = false
    }

    this.state = {
      organizeByTags: organizeByDefault,
      showFilterBytag: false,
      filteredByTags: false,
      selectedTags: []
    }

    this.onOrganizationModeChange = this.onOrganizationModeChange.bind(this)
    this.onTagSelectChange = this.onTagSelectChange.bind(this)
  }

  onOrganizationModeChange () {
    this.setState((prevState) => {
      return {
        organizeByTags: !prevState.organizeByTags
      }
    }, () => {
      // notify parent that the organization mode has changed
      emitter.emit('organizationModeByTagsChanged', this.state.organizeByTags)
    })
  }

  onTagSelectChange (selectedTags) {
    const { setFilter } = this.props
    const isActive = selectedTags.length > 0

    setFilter({
      tags: selectedTags
    })

    this.setState({
      selectedTags,
      filteredByTags: isActive
    })
  }

  render () {
    const {
      organizeByTags,
      showFilterBytag,
      filteredByTags,
      selectedTags
    } = this.state

    return (
      <div style={{ display: 'inline-block' }}>
        <TagEntityTreeFilterButtonToolbar
          showFilter={showFilterBytag}
          active={filteredByTags}
          selectedTags={selectedTags}
          onClick={() => this.setState({ showFilterBytag: true })}
          onTagSelectChange={this.onTagSelectChange}
          onFilterClose={() => this.setState({ showFilterBytag: false })}
        />
        <TagEntityTreeOrganizeButtonToolbar
          active={organizeByTags}
          onClick={this.onOrganizationModeChange}
        />
      </div>
    )
  }
}

export default TagEntityTreeToolbar

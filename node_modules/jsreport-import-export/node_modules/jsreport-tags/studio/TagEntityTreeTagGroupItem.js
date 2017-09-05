import React, { Component } from 'react'
import ShowColor from './ShowColor'

class TagEntityTreeTagGroupItem extends Component {
  render () {
    const { groupType, name, color } = this.props

    if (groupType !== 'tags') {
      return null
    }

    return (
      <span title={name} style={{ display: 'inline-block' }}>
        <ShowColor color={color} width={8} height={15} />
        &nbsp;
      </span>
    )
  }
}

export default TagEntityTreeTagGroupItem

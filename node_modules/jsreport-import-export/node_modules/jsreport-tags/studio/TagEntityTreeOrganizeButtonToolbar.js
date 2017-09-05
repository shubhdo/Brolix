import React, { Component } from 'react'
import { EntityTreeButton } from 'jsreport-studio'

class TagEntityTreeOrganizeButtonToolbar extends Component {
  render () {
    const { onClick, active } = this.props

    return (
      <div title='Organize entities tree by tag' style={{ display: 'inline-block', marginLeft: '0.2rem', marginRight: '0.2rem' }}>
        <EntityTreeButton active={active} onClick={onClick}>
          <i className='fa fa-tags' />
        </EntityTreeButton>
      </div>
    )
  }
}

export default TagEntityTreeOrganizeButtonToolbar

import React, { Component, PropTypes } from 'react'
import ShowColor from './ShowColor'

export default class TagEditor extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  }

  render () {
    const { entity } = this.props

    return (
      <div className='custom-editor'>
        <div>
          <h1><i className='fa fa-tag' /> {entity.name}</h1>
        </div>
        <div>
          Description: <br />
          <p>{entity.description || <i>(no description for this tag)</i>}</p>
        </div>
        <div>
          Color: <ShowColor color={entity.color} />
        </div>
      </div>
    )
  }
}

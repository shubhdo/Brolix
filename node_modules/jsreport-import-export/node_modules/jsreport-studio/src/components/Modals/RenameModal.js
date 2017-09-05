import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {actions, selectors} from '../../redux/entities'
import { entitySets } from '../../lib/configuration.js'

@connect((state, props) => ({ entity: selectors.getById(state, props.options._id) }), { ...actions })
export default class RenameModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }

  rename () {
    if (!this.refs.name.value) {
      return
    }

    const nameAttribute = entitySets[this.props.entity.__entitySet].nameAttribute
    this.props.close()

    this.props.update({
      _id: this.props.entity._id,
      [nameAttribute]: this.refs.name.value
    })
    this.props.save(this.props.entity._id)
  }

  componentDidMount () {
    setTimeout(() => this.refs.name.focus(), 0)
  }

  render () {
    const { entity } = this.props
    const nameAttribute = entitySets[entity.__entitySet].nameAttribute

    return <div>
      <div className='form-group'>
        <label>rename entity</label>
        <input ref='name' type='text' defaultValue={entity[nameAttribute]} />
      </div>

      <div className='button-bar'>
        <button className='button confirmation' onClick={() => this.rename()}>Ok</button>
        <button className='button confirmation' ref='cancel' onClick={() => this.props.close()}>Cancel</button>
      </div>
    </div>
  }
}

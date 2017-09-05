import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {actions, selectors} from '../../redux/entities'

@connect((state, props) => ({ entity: selectors.getById(state, props.options._id, false) }), { ...actions })
export default class DeleteConfirmationModal extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }

  remove () {
    this.props.close()
    this.props.remove(this.props.entity._id)
  }

  cancel () {
    this.props.close()
  }

  componentDidMount () {
    setTimeout(() => this.refs.cancel.focus(), 0)
  }

  render () {
    const { entity } = this.props

    if (!entity) {
      return null
    }

    return <div>
      <div>Are you sure you want to delete {entity.name} ?</div>

      <div className='button-bar'>
        <button className='button danger' onClick={() => this.remove()}>Yes</button>
        <button className='button confirmation' ref='cancel' onClick={() => this.cancel()}>Cancel</button>
      </div>
    </div>
  }
}

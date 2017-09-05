import React, { Component, PropTypes } from 'react'
import style from './EntityTreeButton.scss'

class EntityTreeButton extends Component {
  render () {
    const { onClick, active } = this.props

    return (
      <button
        className={style.entityTreeButton + ' ' + (active ? style.active : '')}
        onClick={onClick}
      >
        {this.props.children}
      </button>
    )
  }
}

EntityTreeButton.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool
}

export default EntityTreeButton

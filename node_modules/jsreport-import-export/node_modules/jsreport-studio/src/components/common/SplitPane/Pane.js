import React from 'react'

const Pane = React.createClass({
  getInitialState () {
    return {}
  },

  render () {
    const split = this.props.split
    const classes = [ 'Pane', split, this.props.className ]

    let style = {
      flex: 1,
      display: 'flex',
      outline: 'none'
    }

    if (this.state.size !== undefined) {
      if (split === 'vertical') {
        style.width = this.state.size
      } else {
        style.height = this.state.size
        style.display = 'flex'
      }
      style.flex = 'none'
    }

    style.minHeight = 0
    style.minWidth = 0

    return (<div className={classes.join(' ')} style={style}>{this.props.children}</div>)
  }
})

export default Pane


import React from 'react'

const handleHover = (Component, Span = 'span') => {
  return class Hover extends React.Component {
    state = { hover: false }
    handleMouseOver = () => this.setState({ hover: true })
    handleMouseOut = () => this.setState({ hover: false })

    render = () => (
      <Span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <Component {...this.props} {...this.state} />
      </Span>
    )
  }
}

export default handleHover

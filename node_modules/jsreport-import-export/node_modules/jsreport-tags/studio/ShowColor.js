import React, { PropTypes } from 'react'
import simpleCheckForValidColor from './simpleCheckForValidColor'
import colorLuminance from './colorLuminance'

const ShowColor = (props) => {
  const {
    color,
    height = 15,
    width = 20
  } = props

  let borderColor = props.borderColor
  let currentColor = 'inherit'

  if (simpleCheckForValidColor(color)) {
    currentColor = color
  }

  if (!borderColor) {
    borderColor = colorLuminance(currentColor, -0.35)
  }

  return (
    <span style={{
      backgroundColor: currentColor,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: borderColor,
      content: ' ',
      display: 'inline-block',
      height: height,
      verticalAlign: 'middle',
      width: width
    }} />
  )
}

ShowColor.propTypes = {
  color: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number
}

export default ShowColor

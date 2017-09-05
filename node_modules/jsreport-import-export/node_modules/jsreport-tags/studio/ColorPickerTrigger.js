import assign from 'object-assign'
import React, { PropTypes } from 'react'
import { Popover } from 'jsreport-studio'
import ShowColor from './ShowColor'
import ColorPicker from './ColorPicker'

const ColorPicketTrigger = (props) => {
  const {
    displayColorPicker,
    color,
    containerStyles,
    onClickColorTrigger,
    onInputChange,
    onChangeSelectionColor,
    onCloseColorPicker,
    translateXColorPickerFromTrigger,
    translateYColorPickerFromTrigger
  } = props

  const containerTriggerPickerStyles = {
    display: 'inline-block',
    height: '32px',
    padding: '5px'
  }

  const defaultContainerStyles = {
    display: 'inline-block'
  }

  const currentColor = color || ''
  const currentContainerStyles = assign({}, defaultContainerStyles, containerStyles)

  let colorPickerContainerStyles = {}

  if (translateXColorPickerFromTrigger || translateYColorPickerFromTrigger) {
    let transformValue = ''

    if (translateXColorPickerFromTrigger) {
      transformValue += `translateX(${translateXColorPickerFromTrigger}) `
    }

    if (translateYColorPickerFromTrigger) {
      transformValue += `translateY(${translateYColorPickerFromTrigger}) `
    }

    colorPickerContainerStyles.transform = transformValue
  }

  return (
    <div style={currentContainerStyles}>
      <span style={containerTriggerPickerStyles}>
        <span style={{ display: 'inline-block' }}>
          <ShowColor color={currentColor} />&nbsp;
          <input
            type='text'
            value={currentColor}
            style={{ width: '90px' }}
            maxLength={7}
            placeholder='#006600'
            onFocus={onClickColorTrigger}
            onChange={(ev) => typeof onInputChange === 'function' && onInputChange(ev.target.value)}
          />
        </span>
      </span>
      <Popover
        wrapper={false}
        open={displayColorPicker}
        onClose={onCloseColorPicker}
      >
        <div style={colorPickerContainerStyles}>
          <ColorPicker
            color={currentColor}
            onChangeComplete={(color) => typeof onChangeSelectionColor === 'function' && onChangeSelectionColor(color.hex)}
          />
        </div>
      </Popover>
    </div>
  )
}

ColorPicketTrigger.propTypes = {
  displayColorPicker: PropTypes.bool.isRequired,
  color: PropTypes.string,
  containerStyles: PropTypes.object,
  onClickColorTrigger: PropTypes.func,
  onCloseColorPicker: PropTypes.func.isRequired,
  onInputChange: PropTypes.func,
  onChangeSelectionColor: PropTypes.func,
  // i know.. it is a shame to decide the position of the color picker
  // in this way, maybe in the future it can be calculated based
  // on the position of the button trigger
  // using a "position" prop to specify the direction
  translateXColorPickerFromTrigger: PropTypes.string,
  translateYColorPickerFromTrigger: PropTypes.string
}

export default ColorPicketTrigger

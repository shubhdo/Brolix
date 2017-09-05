import React, { Component } from 'react'
import Popover from '../../components/common/Popover'
import EntityTreeButton from './EntityTreeButton'
import style from './EntityTreeInputSeach.scss'

class InputSearch extends Component {
  componentDidMount () {
    this.refs.inputFilter && this.refs.inputFilter.focus()
  }

  render () {
    const {
      value,
      onChange,
      onKeyDown
    } = this.props

    return (
      <div className={style.search}>
        <input
          ref='inputFilter'
          type='text'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    )
  }
}

class EntityTreeInputSeach extends Component {
  constructor (props) {
    super(props)

    this.state = {
      displayInput: false,
      filterActive: false,
      filterByName: ''
    }

    this.onNameFilterChange = this.onNameFilterChange.bind(this)
    this.onKeyDownInput = this.onKeyDownInput.bind(this)
    this.closePopover = this.closePopover.bind(this)
  }

  closePopover () {
    this.setState({
      displayInput: false
    })
  }

  onNameFilterChange (ev) {
    const name = ev.target.value

    this.setState({
      filterActive: Boolean(name),
      filterByName: name
    })

    this.props.setFilter({ name })
  }

  onKeyDownInput (ev) {
    if (ev.defaultPrevented) {
      return
    }

    let keyCode = ev.keyCode
    let enterKey = 13

    if (keyCode === enterKey) {
      ev.preventDefault()

      return this.closePopover()
    }
  }

  render () {
    const { displayInput, filterActive, filterByName } = this.state

    return (
      <div title='Filter entities tree by name' className={style.container}>
        <EntityTreeButton active={filterActive} onClick={() => this.setState({ displayInput: true })}>
          <span style={{ display: 'inline-block' }}>
            <i className='fa fa-filter' />
            &nbsp;
            <i className='fa fa-font' />
          </span>
        </EntityTreeButton>
        <Popover
          open={displayInput}
          onClose={this.closePopover}
        >
          <InputSearch
            value={filterByName}
            onChange={this.onNameFilterChange}
            onKeyDown={this.onKeyDownInput}
          />
        </Popover>
      </div>
    )
  }
}

export default EntityTreeInputSeach

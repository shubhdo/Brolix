import React, {Component} from 'react'
import { registerModalHandler } from '../../lib/configuration.js'
import ReactModal from 'react-modal'
import {connect} from 'react-redux'
import {actions} from 'redux/modal'
import style from './Modal.scss'

@connect((state) => ({
  isOpen: state.modal.isOpen,
  text: state.modal.text,
  componentKey: state.modal.componentKey,
  options: state.modal.options
}), { ...actions })
export default class Modal extends Component {

  static propTypes = {
    openCallback: React.PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {}
    registerModalHandler(this)
  }

  componentDidMount () {
    this.props.openCallback(this.open.bind(this))
  }

  renderContent () {
    return (<div className={style.contentWrap}>
      <span className={style.close} onClick={() => this.close()}></span>
      {(this.componentOrText && typeof this.componentOrText !== 'string') ? React.createElement(this.componentOrText, {
        close: () => this.close(),
        options: this.options || this.props.options
      }) : <div dangerouslySetInnerHTML={{ __html: this.componentOrText || this.props.text }} /> }</div>)
  }

  open (componentOrText, options) {
    this.componentOrText = componentOrText
    this.options = options
    this.setState({ isOpen: true })
  }

  close () {
    this.options = null
    this.componentOrText = null
    this.props.close()
    this.setState({ isOpen: false })
  }

  render () {
    const isOpen = this.state.isOpen || this.props.isOpen

    return <ReactModal key='ReactModal'
                       isOpen={isOpen} overlayClassName={style.overlay} className={style.content}
                       onRequestClose={() => this.close()}>
      {isOpen ? this.renderContent() : ''}
    </ReactModal>
  }
}

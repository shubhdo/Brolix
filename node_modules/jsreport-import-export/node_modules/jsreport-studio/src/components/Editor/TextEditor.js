import React, { Component } from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/handlebars'
import 'brace/theme/chrome'
import 'brace/ext/language_tools'
import { subscribeToSplitResize } from '../../lib/configuration.js'

export default class TextEditor extends Component {
  static propTypes = {
    value: React.PropTypes.string,
    onUpdate: React.PropTypes.func.isRequired,
    mode: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  }

  componentDidMount () {
    this.refs.ace.editor.renderer.setScrollMargin(5, 0)
    this.refs.ace.editor.focus()
    this.unsubscribe = subscribeToSplitResize(() => this.refs.ace.editor.resize())
  }

  componentWillUnmount () {
    this.unsubscribe()
  }

  get ace() {
    return this.refs.ace
  }

  render () {
    const { value, onUpdate, name, mode } = this.props

    return (<AceEditor
      key={name}
      name={name}
      mode={mode}
      theme='chrome'
      ref='ace'
      onChange={(v) => onUpdate(v)}
      className='ace'
      width='100%'
      value={value || ''}
      editorProps={{$blockScrolling: Infinity}} />)
  }
}
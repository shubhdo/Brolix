import React, {Component} from 'react'
import {connect} from 'react-redux'
import { actions } from '../../redux/editor'
import { actions as settingsActions, selectors } from '../../redux/settings'
import api from '../../helpers/api.js'
import { previewFrameChangeHandler } from '../../lib/configuration.js'

@connect((state) => ({
  activeTabKey: state.editor.activeTabKey,
  logsWithTemplates: selectors.getLogsWithTemplates(state),
  failedLogsWithTemplates: selectors.getFailedLogsWithTemplates(state)
}), { ...actions, ...settingsActions })
export default class Startup extends Component {
  constructor () {
    super()
    this.state = { templates: [] }
  }

  componentDidMount () {
    this.loadLastModifiedTemplates()
  }

  async loadLastModifiedTemplates () {
    this.fetchRequested = true
    const response = await api.get('/odata/templates?$top=5&$select=name,recipe,modificationDate&$orderby=modificationDate desc')
    await this.props.load()
    this.setState({ templates: response.value })
    this.fetchRequested = false
  }

  componentDidUpdate (props) {
    if (!this.fetchRequested) {
      this.loadLastModifiedTemplates()
    }
  }

  shouldComponentUpdate (props) {
    return props.activeTabKey === 'StartupPage'
  }

  openLogs (m) {
    const errorMessage = m.error ? (m.error.message + '<br/>' + m.error.stack + '<br/><br/><br/>') : ''

    let logs = ''
    if (m.logs && m.logs.length) {
      const start = m.logs[0].timestamp.getTime()
      const rows = m.logs.map((m) => {
        const time = (m.timestamp.getTime() - start)
        return `<tr><td>+${time}</td><td>${m.message}</td></tr>`
      }).join('')
      logs = '<table>' + rows + '</table>'
    }

    return previewFrameChangeHandler('data:text/html;charset=utf-8,' + encodeURI(errorMessage + logs))
  }

  render () {
    const { templates } = this.state
    const { openTab, logsWithTemplates, failedLogsWithTemplates } = this.props

    return <div className='block custom-editor' style={{overflow: 'auto', minHeight: 0, height: 'auto'}}>
      <h2>Last edited templates</h2>

      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>name</th>
              <th>recipe</th>
              <th>last modified</th>
            </tr>
          </thead>
          <tbody>
          {templates.map((t) => <tr key={t._id} onClick={() => openTab({_id: t._id})}>
            <td className='selection'>{t.name}</td>
            <td>{t.recipe}</td>
            <td>{t.modificationDate.toLocaleString()}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
      <h2>Last requests</h2>

      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>template</th>
              <th>started</th>
            </tr>
          </thead>
          <tbody>
          {(logsWithTemplates).map((l, k) => <tr key={k} onClick={() => this.openLogs(l)}>
            <td className='selection'><a style={{textDecoration: 'underline'}} onClick={() => l.template._id ? openTab({_id: l.template._id}) : null}>{l.template.name}</a></td>
            <td>{l.timestamp.toLocaleString()}</td>
          </tr>)}
          </tbody>
        </table>
      </div>

      <h2>LAst failed requests</h2>
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th>template</th>
              <th>error</th>
              <th>started</th>
            </tr>
          </thead>
          <tbody>
          {(failedLogsWithTemplates).map((l, k) => <tr key={k} onClick={() => this.openLogs(l)}>
            <td className='selection'><a style={{textDecoration: 'underline'}} onClick={() => l.template._id ? openTab({_id: l.template._id}) : null}>{l.template.name}</a></td>
            <td>{l.error.message.length < 90 ? l.error.message : (l.error.message.substring(0, 80) + '...')}</td>
            <td>{l.timestamp.toLocaleString()}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }
}

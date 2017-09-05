import React, {Component} from 'react'
import Tab from './Tab'
import TabPane from './TabPane.js'
import { editorComponents } from '../../lib/configuration.js'

export default class EditorTabs extends Component {
  static propTypes = {
    onUpdate: React.PropTypes.func.isRequired,
    activeTabKey: React.PropTypes.string,
    tabs: React.PropTypes.array.isRequired
  }

  renderEntityTab (t, onUpdate) {
    return <Tab key={t.tab.key} >
      {React.createElement(editorComponents[ t.tab.editorComponentKey || t.entity.__entitySet ], {
        entity: t.entity,
        tab: t.tab,
        ref: t.tab.key,
        onUpdate: (o) => onUpdate(o)
      })}
    </Tab>
  }

  render () {
    const { activeTabKey, onUpdate, tabs } = this.props

    return <TabPane
      activeTabKey={activeTabKey}>{tabs.map((t) =>
        this.renderEntityTab(t, onUpdate)
    )}
    </TabPane>
  }
}
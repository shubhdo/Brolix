import React, {Component} from 'react'
import { tabTitleComponents, entitySets } from '../../lib/configuration.js'
import style from './Tabs.scss'

export default class EditorTabs extends Component {
  static propTypes = {
    activeTabKey: React.PropTypes.string,
    activateTab: React.PropTypes.func.isRequired,
    closeTab: React.PropTypes.func.isRequired,
    tabs: React.PropTypes.array.isRequired
  }

  handleTabClick (t, e) {
    if (e.nativeEvent.which === 2) {
      e.stopPropagation()
      return this.props.closeTab(t.tab.key)
    }

    this.props.activateTab(t.tab.key)
  }

  renderTitle (t) {
    const { activeTabKey, closeTab } = this.props

    return <div
      className={style.tabTitle + ' ' + (t.tab.key === activeTabKey ? style.active : '')} key={t.tab.key}
      onClick={(e) => this.handleTabClick(t, e)}> <span>
          {t.tab.titleComponentKey ? React.createElement(tabTitleComponents[t.tab.titleComponentKey], {
            entity: t.entity,
            tab: t.tab
          }) : (<span>{t.tab.title || (t.entity[entitySets[t.entity.__entitySet].nameAttribute] + (t.entity.__isDirty ? '*' : ''))}</span>)}</span>

      <div
        className={style.tabClose}
        onClick={(e) => { e.stopPropagation(); closeTab(t.tab.key) }}></div>
    </div>
  }

  render () {
    return <div className={style.tabTitles}>
      {this.props.tabs.map((t) => this.renderTitle(t))}
    </div>
  }
}

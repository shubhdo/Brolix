import Studio from 'jsreport-studio'

Studio.readyListeners.push(async () => {
  const trialModal = () => Studio.openModal(() => <div><p>Free license is limited to maximum 5 templates.
    Your jsreport instance is now running in one month trial. Please buy
    the enterprise license if you want to continue using jsreport after the trial expires.
  </p>

    <p>The instructions for buying enterprise license can be
      found <a href='http://jsreport.net/buy' target='_blank'>here</a>.
    </p>
  </div>)

  if (Studio.extensions['licensing'].options.license === 'trial' && Studio.getAllEntities().filter((e) => e.__entitySet === 'templates' && !e.__isNew).length > 5) {
    trialModal()
  }

  if (Studio.extensions['licensing'].options.license === 'free') {
    const interval = setInterval(() => {
      if (Studio.getAllEntities().filter((e) => e.__entitySet === 'templates' && !e.__isNew).length > 5) {
        clearInterval(interval)
        trialModal()
        Studio.extensions['licensing'].options.license = 'trial'
        Studio.api.post('/api/licensing/trial', {})
      }
    }, 10000)
  }

  Studio.addToolbarComponent((props) => <div
    className='toolbar-button' onClick={() => window.open('http://jsreport.net/buy', '_blank')}>
    <div style={{textTransform: 'capitalize'}}><i className='fa fa-gavel' /> {Studio.extensions['licensing'].options.license}</div>
  </div>, 'settings')
})

module.exports = function (reporter) {
  reporter.afterRenderListeners.add('requestsLog', this, function (request) {
    if (request.options.isChildRequest) {
      return
    }

    return reporter.settings.findValue('requestsLog', request).then(function (v) {
      v = v || []
      v.unshift({
        template: { shortid: request.template.shortid },
        timestamp: new Date(),
        logs: request.logs || []
      })

      if (v.length > 5) {
        v.pop()
      }

      return reporter.settings.addOrSet('requestsLog', v, request)
    })
  })

  if (!reporter.renderErrorListeners) {
    return
  }

  reporter.renderErrorListeners.add('failedRequestsLog', this, function (request, response, err) {
    if (request.options.isChildRequest) {
      return
    }

    return reporter.settings.findValue('failedRequestsLog', request).then(function (v) {
      v = v || []
      v.unshift({
        template: { shortid: request.template.shortid },
        timestamp: new Date(),
        logs: request.logs || [],
        error: {
          message: err.message,
          stack: err.stack
        }
      })

      if (v.length > 5) {
        v.pop()
      }

      return reporter.settings.addOrSet('failedRequestsLog', v, request)
    })
  })
}

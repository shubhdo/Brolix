module.exports = function (reporter) {
  reporter.afterRenderListeners.add('requestsLog', this, function (request) {
    if (request.options.isChildRequest) {
      return
    }

    return reporter.settings.findValue('requestsLog', request).then(function (v) {
      v = v || []

      var logs = normalizeLogs(request.logs || [])

      v.unshift({
        template: { shortid: request.template.shortid },
        timestamp: new Date(),
        logs: logs
      })

      // we only store logs for the last five requests
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

      var logs = normalizeLogs(request.logs || [])

      v.unshift({
        template: { shortid: request.template.shortid },
        timestamp: new Date(),
        logs: logs,
        error: {
          message: err.message,
          stack: err.stack
        }
      })

      // we only store logs for the last five requests
      if (v.length > 5) {
        v.pop()
      }

      return reporter.settings.addOrSet('failedRequestsLog', v, request)
    })
  })
}

function normalizeLogs (logs) {
  var logsSize = 0
  var MAX_LOGS_LINES = 200 // maximum of 200 logs lines
  var MAX_LOGS_SIZE = 500000 // (bytes) maximum of 500kb for total size of logs

  // only save a maximum of logs lines (from the last)
  var finalLogs = logs.length > MAX_LOGS_LINES ? logs.slice(MAX_LOGS_LINES * -1) : logs

  var greaterThanMaxSize = finalLogs.some(function (log) {
    var size = new Buffer(log.message || '', 'utf8').length

    logsSize += size

    return logsSize > MAX_LOGS_SIZE
  })

  if (greaterThanMaxSize) {
    // trim log messages if the size is greater than the maximum
    finalLogs = finalLogs.map(function (log) {
      // let's pretend that one character is equal to one byte,
      // so the minimum size for each message is MAX_LOGS_SIZE/MAX_LOGS_LINES bytes
      log.message = (log.message || '').substring(0, parseInt(MAX_LOGS_SIZE / MAX_LOGS_LINES, 10)) + '...'
      return log
    })
  }

  return finalLogs
}

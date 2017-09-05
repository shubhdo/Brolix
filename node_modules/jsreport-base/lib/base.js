var baseMatch = /(<html>[\s\S]*<head>)/m

module.exports = function (reporter, definition) {
  reporter.beforeRenderListeners.add('base', function (req, res) {
    var base = req.options.base || definition.options.url

    if (base) {
      base = base.replace('${cwd}', 'file:///' + process.cwd().replace('\\', '/')) // eslint-disable-line
      req.template.content = req.template.content.replace(baseMatch, '$1<base href=\'' + base + '\' />')

      if (req.template.content.indexOf(base)) {
        req.logger.debug('Base url injected: ' + base)
      } else {
        req.logger.debug('Base url not injected because the html format was not recognised.')
      }
    } else {
      req.logger.debug('Base url not specified, skipping its injection.')
    }
  })
}

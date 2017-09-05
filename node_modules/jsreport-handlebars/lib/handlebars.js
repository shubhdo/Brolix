/*!
 * Copyright(c) 2014 Jan Blaha
 */

var path = require('path')
var hbPath = path.join(path.dirname(require.resolve('handlebars')), '../')

module.exports = function (reporter, definition) {
  if (reporter.compilation) {
    reporter.compilation.include('handlebarsModule', hbPath)
  }

  reporter.options.tasks.nativeModules.push({
    globalVariableName: 'handlebars',
    module: reporter.execution ? reporter.execution.resolve('handlebarsModule') : hbPath
  })

  // alias Handlebars=handlebars
  reporter.options.tasks.nativeModules.push({
    globalVariableName: 'Handlebars',
    module: reporter.execution ? reporter.execution.resolve('handlebarsModule') : hbPath
  })

  reporter.extensionsManager.engines.push({
    name: 'handlebars',
    pathToEngine: path.join(__dirname, 'handlebarsEngine.js')
  })
    // we need to addFileExtensionResolver after the store provider extension is initialized, but before
    // every other extension like sample template is processed
  reporter.initializeListeners.insert(0, 'handlebars', function () {
    reporter.documentStore.addFileExtensionResolver(function (doc, entitySetName, entityType, propertyType) {
      if (doc.engine === 'handlebars' && propertyType.document.engine) {
        return 'handlebars'
      }
    })
  })
}

process.env.debug = 'jsreport'

var jsreport = require('jsreport-core')
var Promise = require('bluebird')
var path = require('path')
var omit = require('lodash.omit')
var writeFileAsync = Promise.promisify(require('fs').writeFile)

var helpers = require('jsreport-import-export/lib/helpers.js')

var templates = require('jsreport-templates')
var xlsx = require('jsreport-xlsx')
var data = require('jsreport-data')
var scripts = require('jsreport-scripts')
var assets = require('jsreport-assets')
var handlebars = require('jsreport-handlebars')
var phantomPdf = require('jsreport-phantom-pdf')
var fsStore = require('jsreport-fs-store')

var reporter = jsreport({connectionString: { name: 'fs' }})

reporter.use(templates())
reporter.use(data())
reporter.use(xlsx())
reporter.use(scripts({allowedModules: '*'}))
reporter.use(assets())
reporter.use(handlebars())
reporter.use(phantomPdf())
reporter.use(fsStore({dataDirectory: path.join(__dirname, '../samples')}))

var entitySets = ['data', 'templates', 'assets', 'scripts', 'xlsxTemplates']

reporter.init().then(function () {
  return Promise.all(entitySets.map(function (es) {
    return reporter.documentStore.collection(es).find({})
  })).then(function (results) {
    var allInOne = {}
    for (var i = 0; i < results.length; i++) {
      console.log(entitySets[i] + ':' + results[i].length)
      allInOne[entitySets[i]] = results[i].map(function (e) {
        return omit(e, ['_id', 'modificationDate', 'creationDate'])
      })

      helpers.bufferToBase64(reporter.documentStore.model, entitySets[i], allInOne[entitySets[i]])
    }

    return writeFileAsync('samples.json', JSON.stringify(allInOne))
  }).then(function () {
    console.log('entities saved into samples.json')
    process.exit()
  })
}).catch(function (e) {
  console.error(e)
  process.exit(1)
})

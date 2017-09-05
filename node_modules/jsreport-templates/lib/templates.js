/*!
 * Copyright(c) 2014 Jan Blaha
 *
 * Core extension responsible for storing, versioning and loading report templates for render request..
 */

var shortid = require('shortid')
var events = require('events')
var util = require('util')
var Promise = require('bluebird')
var extend = require('node.extend.without.arrays')

var Templating = function (reporter, definition) {
  this.name = 'templates'
  this.reporter = reporter
  this.definition = definition
  this.documentStore = reporter.documentStore

  this._defineEntities()

  this.reporter.beforeRenderListeners.add(definition.name, Templating.prototype.handleBeforeRender.bind(this))
  this.reporter.on('express-configure', Templating.prototype._configureExpress.bind(this))
}

util.inherits(Templating, events.EventEmitter)

Templating.prototype.handleBeforeRender = function (request) {
  var self = this

  if (!request.template._id && !request.template.shortid && !request.template.name) {
    if (!request.template.content) {
      var err = new Error('Template must contains _id, shortid or content attribute.')
      err.weak = true
      throw err
    }

    request.logger.info('Rendering anonymous template { recipe:' +
      request.template.recipe + ',engine:' + request.template.engine + '}')

    return
  }

  function findTemplate () {
    function findQuery () {
      if (request.template._id) {
        return { _id: request.template._id }
      }

      if (request.template.shortid) {
        return { shortid: request.template.shortid }
      }

      if (request.template.name) {
        return { name: request.template.name }
      }
    }

    var query = findQuery()

    if (!query) {
      return [request.template]
    }

    return self.documentStore.collection('templates').find(query, request)
  }

  return findTemplate().then(function (templates) {
    if (templates.length !== 1 && !request.template.content) {
      var err = new Error('Unable to find specified template or user doesnt have permissions to read it: ' + (request.template._id || request.template.shortid || request.template.name))
      err.weak = true
      throw err
    }

    request.template = templates.length ? extend(true, templates[0], request.template) : request.template
    request.template.content = request.template.content || ''
    request.logger.info('Rendering template {shortid:' + request.template.shortid + ', recipe:' + request.template.recipe + ',engine:' + request.template.engine + '}')
  })
}

Templating.prototype._configureExpress = function (app) {
  var self = this

  app.get('/templates/:shortid', function (req, res, next) {
    self.documentStore.collection('templates').find({
      shortid: req.params.shortid
    }).then(function (templates) {
      if (templates.length !== 1) {
        return Promise.reject(new Error('Unauthorized'))
      }

      req.template = templates[0]

      return self.reporter.render(req).then(function (response) {
        if (response.headers) {
          for (var key in response.headers) {
            if (response.headers.hasOwnProperty(key)) {
              res.setHeader(key, response.headers[key])
            }
          }
        }
        response.stream.pipe(res)
      })
    }).catch(function (e) {
      next(e)
    })
  })
}

Templating.prototype._beforeUpdateHandler = function (query, update) {
  update.$set.modificationDate = new Date()
}

Templating.prototype._defineEntities = function () {
  var templateAttributes = {
    _id: { type: 'Edm.String', key: true },
    shortid: { type: 'Edm.String' },
    name: { type: 'Edm.String', publicKey: true },
    content: { type: 'Edm.String', document: { extension: 'html', engine: true } },
    recipe: { type: 'Edm.String' },
    helpers: { type: 'Edm.String', document: { extension: 'js' } },
    engine: { type: 'Edm.String' },
    modificationDate: { type: 'Edm.DateTimeOffset' }
  }

  this.documentStore.registerEntityType('TemplateType', templateAttributes)
  this.documentStore.registerEntitySet('templates', {
    entityType: 'jsreport.TemplateType',
    humanReadableKey: 'shortid',
    splitIntoDirectories: true
  })

  var self = this
  this.reporter.initializeListeners.add('templates', function () {
    var col = self.documentStore.collection('templates')
    col.beforeUpdateListeners.add('templates', Templating.prototype._beforeUpdateHandler.bind(self))
    col.beforeInsertListeners.add('templates', function (doc) {
      doc.shortid = doc.shortid || shortid.generate()
      doc.modificationDate = new Date()
    })
  })
}

module.exports = function (reporter, definition) {
  reporter[definition.name] = new Templating(reporter, definition)
}

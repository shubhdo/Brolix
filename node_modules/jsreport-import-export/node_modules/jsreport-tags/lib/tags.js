'use strict'

var shortid = require('shortid')
var reservedTagNamesExport = require('../shared/reservedTagNames')
var reservedTagNames = reservedTagNamesExport.default

module.exports = function (reporter, definition) {
  definition.options = reporter.options.tags || definition.options || {}
  definition.options.organizeByDefault = Boolean(definition.options.organizeByDefault)

  // define entity Tag
  reporter.documentStore.registerEntityType('TagType', {
    _id: { type: 'Edm.String', key: true },
    name: { type: 'Edm.String', publicKey: true },
    shortid: { type: 'Edm.String' },
    description: { type: 'Edm.String' },
    color: { type: 'Edm.String' },
    modificationDate: { type: 'Edm.DateTimeOffset' }
  })

  // expose it as an entity set
  reporter.documentStore.registerEntitySet('tags', {
    entityType: 'jsreport.TagType',
    humanReadableKey: 'shortid',
    splitIntoDirectories: true
  })

  // after document store initialization, extend all entity types with tag information
  reporter.documentStore.on('before-init', function (documentStore) {
    for (var key in documentStore.model.entitySets) {
      var entitySet = documentStore.model.entitySets[key]

      var entityTypeName = entitySet.entityType.replace(documentStore.model.namespace + '.', '')

      // ignore TagType
      if (entityTypeName === 'TagType') {
        continue
      }

      documentStore.model.entityTypes[entityTypeName].tags = {
        type: 'Collection(Edm.String)'
      }
    }
  })

  // initialize operations after the extension has been loaded
  reporter.initializeListeners.add(definition.name, function () {
    var col = reporter.documentStore.collection('tags')
    var HEX_COLOR_REGEXP = /^#[0-9A-F]{6}$/i

    col.beforeInsertListeners.add('tags', function (doc) {
      doc.shortid = doc.shortid || shortid.generate()
      doc.modificationDate = new Date()

      if (reservedTagNames.indexOf(doc.name) !== -1) {
        throw new Error(doc.name + ' can\'t be used as a tag name, it is a reserved name')
      }

      if (!doc.color) {
        throw new Error('color field cannot be empty')
      }

      if (!HEX_COLOR_REGEXP.test(doc.color)) {
        throw new Error('color field must have a valid hex value')
      }
    })

    col.beforeUpdateListeners.add('tags', function (query, update) {
      update.$set.modificationDate = new Date()

      if ('name' in update.$set) {
        if (reservedTagNames.indexOf(update.$set.name) !== -1) {
          throw new Error(update.$set.name + ' can\'t be used as a tag name, it is a reserved name')
        }
      }

      if ('color' in update.$set) {
        if (!update.$set.color) {
          throw new Error('color field cannot be empty')
        }

        if (!HEX_COLOR_REGEXP.test(update.$set.color)) {
          throw new Error('color field must have a valid hex value')
        }
      }
    })
  })
}

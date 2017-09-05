/* eslint no-path-concat: 0 */

var Promise = require('bluebird')
var path = require('path')
var fs = require('fs')
var readFileAsync = Promise.promisify(fs.readFile)
var writeFileAsync = Promise.promisify(fs.writeFile)
var request = require('request')
var hostname = require('os').hostname()
var crypto = require('crypto')
var md5 = crypto.createHash('md5')
var hostId = md5.update(hostname + __dirname).digest('hex')
var mkdirp = require('mkdirp')
var mkdirpAsync = Promise.promisify(mkdirp)

function verifyLicenseKey (reporter, definition, key) {
  var trimmedKey = key.trim()

  reporter.logger.info('Veryfing license key ' + trimmedKey)
  return countTemplates(reporter).then(function (count) {
    return verifyInCache(reporter, definition, {
      licenseKey: trimmedKey,
      mode: reporter.options.mode,
      numberOfTemplates: count,
      version: reporter.version,
      hostId: hostId
    })
  })
}

function verifyInCache (reporter, definition, m) {
  var pathToCacheFile = path.join(reporter.options.tempDirectory, 'licensing', 'cache.json')

  function verifyAndWriteCache () {
    return verifyInService(reporter, definition, m).then(function (res) {
      m.lastCheck = new Date().getTime()
      m.license = res.license
      m.message = res.message
      m.error = res.error
      return writeFileAsync(pathToCacheFile, JSON.stringify(m)).then(function () {
        return res
      })
    })
  }

  return mkdirpAsync(path.join(reporter.options.tempDirectory, 'licensing')).then(function () {
    return readFileAsync(pathToCacheFile, 'utf8').then(function (content) {
      return JSON.parse(content)
    }).catch(function () {
      // cache file not found or corrupted, we create it later
      return {}
    })
  }).then(function (cache) {
    if (cache.licenseKey === m.licenseKey && cache.mode === m.mode &&
        cache.numberOfTemplates === m.numberOfTemplates && cache.version === m.version &&
        cache.hostId === m.hostId && (new Date(cache.lastCheck + 120000) > new Date())) {
      reporter.logger.info('Applying cached license information')
      return { license: cache.license, message: cache.message, error: cache.error }
    }

    return verifyAndWriteCache()
  }).then(function (res) {
    if (res.error) {
      if (reporter.express && reporter.express.server) {
        reporter.express.server.close()
      }
      throw new Error(res.error)
    }

    definition.options.license = res.license
    reporter.logger.info(res.message)
  })
}

function verifyInService (reporter, definition, m) {
  return new Promise(function (resolve) {
    var isDone = false

    function handleFailedVerification () {
      isDone = true

      if (m.licenseKey === 'free' && m.numberOfTemplates > 5) {
        return resolve({error: 'Free license cannot be used for more than 5 templates'})
      }

      if (m.licenseKey === 'free') {
        resolve({license: 'free', message: 'Licensing server is not reachable. Using free license.'})
      } else {
        resolve({license: 'enterprise', message: 'Licensing server is not reachable. Skipping remote verification and starting as enterprise.'})
      }
    }

    var timeout = setTimeout(handleFailedVerification, 3000).unref()

    request({
      url: 'https://jsreportonline.net/license-key',
      method: 'POST',
      body: m,
      json: true
    }, function (err, response, body) {
      if (isDone) {
        return
      }
      clearTimeout(timeout)

      if (err || response.statusCode !== 200 || !Number.isInteger(body.status)) {
        return handleFailedVerification()
      }

      if (body.status === 0) {
        return resolve({license: body.license, message: body.message})
      }

      resolve({error: body.message})
    })
  })
}

function countTemplates (reporter) {
  return reporter.documentStore.collection('templates').count({})
}

module.exports = function (reporter, definition) {
  reporter.on('express-configure', function (app) {
    app.post('/api/licensing/trial', function (req, res, next) {
      verifyLicenseKey(reporter, definition, 'free').then(function () {
        res.send({ status: 0 })
      }).catch(function (e) {
        reporter.logger.warn('Unable to start trial license')
        res.send({ status: 1 })
      })
    })
  })

  reporter.initializeListeners.add('licensing', function () {
    if (reporter.options['license-key']) {
      return verifyLicenseKey(reporter, definition, reporter.options['license-key'])
    }

    var licenseKeyPath
    if (fs.existsSync(path.join(reporter.options.rootDirectory, 'license-key.txt'))) {
      licenseKeyPath = path.join(reporter.options.rootDirectory, 'license-key.txt')
    }

    if (fs.existsSync(path.join(reporter.options.dataDirectory, 'license-key.txt'))) {
      licenseKeyPath = path.join(reporter.options.dataDirectory, 'license-key.txt')
    }

    if (licenseKeyPath) {
      return readFileAsync(licenseKeyPath, 'utf8').then(function (key) {
        if (key.charCodeAt(0) === 0xFEFF) {
          key = key.substring(1)
        }
        return verifyLicenseKey(reporter, definition, key.toString())
      })
    }

    return verifyLicenseKey(reporter, definition, 'free')
  })
}

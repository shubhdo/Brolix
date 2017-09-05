var Express = require('express')
var favicon = require('serve-favicon')
var compression = require('compression')
var path = require('path')
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
var url = require('url')
var requestLog = require('./requestLog')

module.exports = function (reporter, definition) {
  var distPath = reporter.execution ? reporter.execution.tempDirectory : path.join(__dirname, '../static/dist')
  requestLog(reporter)
  var compiler

  function sendIndex (req, res, next) {
    var indexHtml = path.join(distPath, 'index.html')

    function send (err, content) {
      if (err) {
        return next(err)
      }

      content = content.replace('client.js', reporter.options.appPath + 'studio/assets/client.js')

      res.send(content
        .replace('$jsreportVersion', reporter.version)
        .replace('$jsreportMode', reporter.options.mode))
    }

    function tryRead () {
      compiler.outputFileSystem.readFile(indexHtml, 'utf8', function (err, content) {
        if (err) {
          return setTimeout(tryRead, 1000)
        }

        send(null, content)
      })
    }

    if (reporter.options.mode === 'jsreport-development') {
      tryRead()
    } else {
      fs.readFile(indexHtml, 'utf8', send)
    }
  }

  function redirectOrSendIndex (req, res, next) {
    var reqUrl = url.parse(req.originalUrl)
    if (reqUrl.pathname[reqUrl.pathname.length - 1] !== '/') {
      return res.redirect(reqUrl.pathname + '/' + (reqUrl.search || ''))
    }

    sendIndex(req, res, next)
  }

  reporter.on('after-authentication-express-routes', function () {
    return reporter.express.app.get('/', redirectOrSendIndex)
  })

  reporter.on('after-express-static-configure', function () {
    if (!reporter.authentication) {
      return reporter.express.app.get('/', redirectOrSendIndex)
    }
  })

  reporter.on('before-express-configure', function () {
    reporter.express.app.use('/api/report', function (req, res, next) {
      res.cookie('render-complete', true)
      next()
    })
  })

  reporter.on('express-configure', function () {
    if (reporter.options.mode !== 'jsreport-development') {
      if (!fs.existsSync(path.join(distPath, 'extensions.client.js'))) {
        fs.renameSync(path.join(distPath, '1.client.js'), path.join(distPath, 'extensions.client.js'))
      }
      var webpackWrap = fs.readFileSync(path.join(distPath, 'extensions.client.js'), 'utf8')
      var webpackExtensions = webpackWrap.replace('$extensionsHere', function () {
        return reporter.extensionsManager.extensions.map(function (e) {
          try {
            if (reporter.execution && reporter.execution.resource(e.name)) {
              return reporter.execution.resource(e.name)
            }
            return fs.readFileSync(path.join(e.directory, 'studio/main.js'))
          } catch (e) {
            return ''
          }
        }).join('\n')
      })
      fs.writeFileSync(path.join(distPath, '1.client.js'), webpackExtensions)
    } else {
      fs.writeFileSync(path.join(__dirname, '../src/extensions_dev.js'), reporter.extensionsManager.extensions.map(function (e) {
        try {
          fs.statSync(path.join(e.directory, '/studio/main_dev.js'))
          return "import '" + path.relative(path.join(__dirname, '../src'), path.join(e.directory, '/studio/main_dev.js')).replace(/\\/g, '/') + "'"
        } catch (e) {
          return ''
        }
      }).join('\n'))
    }

    var app = reporter.express.app

    app.use(compression())
    app.use(favicon(path.join(reporter.execution ? distPath : path.join(__dirname, '../static'), 'favicon.ico')))

    if (reporter.options.mode === 'jsreport-development') {
      var webpack = require('jsreport-studio-dev').deps.webpack
      var webpackConfig = require('../webpack/dev.config')(reporter.extensionsManager.extensions)
      compiler = webpack(webpackConfig)
      reporter.express.app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: '/studio/assets/',
        hot: true,
        inline: true,
        lazy: false,
        stats: { colors: true, chunks: false }
      }))
      reporter.express.app.use(require('webpack-hot-middleware')(compiler))
    }

    app.use('/studio/assets', Express.static(reporter.execution ? reporter.execution.tempDirectory : path.join(__dirname, '../static', 'dist')))

    app.get('/studio/*', sendIndex)
  })

  if (reporter.compilation) {
    reporter.compilation.exclude('webpack-dev-middleware', 'webpack-hot-middleware', 'webpack', 'babel-polyfill', 'html-webpack-plugin', 'jsreport-studio-dev')
    reporter.compilation.resourceInTemp('favicon.ico', path.join(__dirname, '../static', 'favicon.ico'))

    reporter.initializeListeners.add('studio', function () {
      return Promise.all(reporter.extensionsManager.extensions.map(function (e) {
        return fs.statAsync(path.join(e.directory, 'studio', 'main.js')).then(function () {
          return e
        }).catch(function () {
          return null
        })
      })).then(function (mains) {
        mains.forEach(function (e) {
          if (e) {
            reporter.compilation.resource(e.name, path.join(e.directory, 'studio', 'main.js'))
          }
        })

        return fs.readdirAsync(distPath).then(function (files) {
          files.forEach(function (f) {
            if (f.indexOf('.map') === -1 && f.indexOf('1.client.js') === -1) {
              reporter.compilation.resourceInTemp(f, path.join(distPath, f))
            }
          })
        })
      })
    })
  }
}

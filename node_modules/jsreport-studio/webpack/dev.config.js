require('babel-polyfill')

// Webpack config for development
var fs = require('fs')
var path = require('path')
var jsreportStudioDev = require('jsreport-studio-dev')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var assetsPath = path.resolve(__dirname, '../static/dist')
var babelrc = fs.readFileSync(path.join(__dirname, '../.babelrc'))
var babelrcObject = {}

var webpack = jsreportStudioDev.deps.webpack

try {
  babelrcObject = JSON.parse(babelrc)
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.')
  console.error(err)
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {}

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || []
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins)

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins })
delete babelLoaderQuery.env

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || []
var reactTransform = null
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i]
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin
  }
}

if (!reactTransform) {
  reactTransform = [require.resolve('babel-plugin-react-transform'), { transforms: [] }]
  babelLoaderQuery.plugins.push(reactTransform)
}

for (var j = 0; j < babelLoaderQuery.plugins.length; j++) {
  if (typeof babelLoaderQuery.plugins[j] === 'string') {
    babelLoaderQuery.plugins[j] = require.resolve('babel-plugin-' + babelLoaderQuery.plugins[j])
  }

  if (Array.isArray(babelLoaderQuery.plugins[j])) {
    babelLoaderQuery.plugins[j][0] = require.resolve('babel-plugin-' + babelLoaderQuery.plugins[j][0])
  }
}

for (var p = 0; p < babelLoaderQuery.presets.length; p++) {
  babelLoaderQuery.presets[p] = require.resolve('babel-preset-' + babelLoaderQuery.presets[p])
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], { transforms: [] })
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
})

module.exports = function (extensions) {
  return {
    devtool: 'eval-source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
      'main': [
        './src/client.js',
        'webpack-hot-middleware/client',
        'font-awesome-webpack!./src/theme/font-awesome.config.js'
      ]
    },
    output: {
      path: assetsPath,
      filename: 'client.js'
    },
    externals: [
      function (context, request, callback) {
        if (request === 'jsreport-studio') {
          return callback(null, 'Studio')
        }

        callback()
      },
      'react/addons', 'react/lib/ExecutionEnvironment', 'react/lib/ReactContext'
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['babel?' + JSON.stringify(babelLoaderQuery)],
          exclude: function (modulePath) {
            for (var key in extensions) {
              if (modulePath.indexOf(extensions[key].directory) !== -1 && modulePath.replace(extensions[key].directory, '').indexOf('node_modules') === -1) {
                return false
              }
            }

            return true
          }
        },
        { test: /\.json$/, loader: 'json-loader' },
        {
          test: /\.less$/,
          loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader!less?outputStyle=expanded&sourceMap'
        },
        {
          test: /\.scss$/,
          loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader!sass?outputStyle=expanded&sourceMap',
          exclude: [/.*theme.*/]
        },
        {
          loader: 'style!css?importLoaders=2!postcss-loader!sass?outputStyle=expanded',
          include: [/.*theme.*\.scss/]
        },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
        { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
      ]
    },
    postcss: function () {
      return [
        jsreportStudioDev.deps['postcss-flexbugs-fixes'],
        jsreportStudioDev.deps.autoprefixer
      ]
    },
    progress: true,
    resolve: {
      modulesDirectories: [
        'src',
        'node_modules'
      ],
      extensions: ['', '.json', '.js', '.jsx'],
      fallback: path.join(__dirname, '../node_modules')
    },
    resolveLoader: {
      root: path.join(__dirname, '../node_modules')
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: path.join(__dirname, '../static/index.html')
      }),
      // hot reload
      new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/webpack-stats\.json$/),
      new webpack.DefinePlugin({
        __DEVELOPMENT__: true
      })
    ]
  }
}

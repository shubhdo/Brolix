require('babel-polyfill')

// Webpack config for creating the production bundle.
var path = require('path')
var jsreportStudioDev = require('jsreport-studio-dev')
var CleanPlugin = require('clean-webpack-plugin')
var strip = require('strip-loader')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var webpack = jsreportStudioDev.deps.webpack

var projectRootPath = path.resolve(__dirname, '../')
var assetsPath = path.resolve(projectRootPath, './static/dist')

module.exports = {
  devtool: 'hidden-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      './src/client.js',
      'font-awesome-webpack!./src/theme/font-awesome.config.prod.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: 'client.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel'] },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.less$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader!less?outputStyle=expanded&sourceMap'
      },
      {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss-loader!sass?outputStyle=expanded&sourceMap',
        exclude: [ /.*theme.*/ ]
      },
      {
        loader: 'style!css?importLoaders=2!postcss-loader!sass?outputStyle=expanded',
        include: [ /.*theme.*\.scss/ ]
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
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    new CleanPlugin([assetsPath], { root: projectRootPath }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      __DEVELOPMENT__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new HtmlWebpackPlugin({
      hash: true,
      template: path.join(__dirname, '../static/index.html')
    })
  ]
}

var spawn = require('child_process').spawn
var path = require('path')
var assign = require('object-assign')
var isWin = /^win/.test(process.platform);

module.exports = function (command, args, options) {
  var pathToWinRun = path.join(__dirname, 'WinRun.exe')

    if (isWin) {
        args = assign([], args)
        args.unshift(command)

        if (options && options.WinRunPath) {
          pathToWinRun = options.WinRunPath
        }

        return spawn(pathToWinRun, args, options)
    }

    return spawn(command, args, options)
}

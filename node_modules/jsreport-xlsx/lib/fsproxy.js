'use strict';

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports.write = function (tmp, data) {
  var file = _path2.default.join(tmp, _uuid2.default.v1() + '.xml');

  _fs2.default.writeFileSync(file, _zlib2.default.deflateSync(data));
  return file;
};
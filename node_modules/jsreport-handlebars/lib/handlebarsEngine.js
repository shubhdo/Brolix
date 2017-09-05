/*!
 * Copyright(c) 2016 Jan Blaha
 */
var pattern = /%}%/g
var Handlebars = require('handlebars')

var regexDoubleBrackets = /({#[^{}]{0,20} {{{[^{}]{0,20})(}}}})/g
var regexTrippleBrackets = /({#[^{}]{0,20} {{[^{}]{0,20})(}}})/g

module.exports = function (html) {
  // replace {#image {{a}}} with {#image {{a}}%}% and back so it compiles
  html = html.replace(regexDoubleBrackets, '$1}}}%}%')
  html = html.replace(regexTrippleBrackets, '$1}}%}%')

  var compiledTemplate = Handlebars.compile(html)

  return function (helpers, data) {
    try {
      for (var h in helpers) {
        if (helpers.hasOwnProperty(h)) {
          Handlebars.registerHelper(h, helpers[h])
        }
      }

      return compiledTemplate(data).replace(pattern, '}')
    } finally {
      // unregister the helpers to hide them from other executions
      for (var ah in helpers) {
        if (helpers.hasOwnProperty(ah)) {
          Handlebars.unregisterHelper(ah, helpers[ah])
        }
      }
    }
  }
}

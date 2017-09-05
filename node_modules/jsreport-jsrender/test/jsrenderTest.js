var should = require("should");
var jsrender = require("../lib/jsrenderEngine");

describe('jsrender', function () {

  it('should render html', function () {
    var html = jsrender("Hey")(null, null);
    html.should.be.eql("Hey");
  });

  it('should be able to use helpers', function () {
    var html = jsrender("{{>~a()}}")({ a: function () { return "Hey"; } }, null);
    html.should.be.eql("Hey");
  });

  it('should be able to use data', function () {
    var html = jsrender("{{:a}}")(null, { a: "Hey" });
    html.should.be.eql("Hey");
  });

  it('should throw when missing helper', function () {
    should(function () {
      jsrender("{{:~missing()}}")(null, {});
    }).throw();
  });

  it('should throw when syntax error', function () {
    should(function () {
      jsrender("{{:~missing()}}")(null, {});
    }).throw();
  });

  it('should throw when use constr expression', function () {
    should(function () {
      jsrender('{{:#tmpl.constructor("var foo=3;")()}}')(null, {});
    }).throw();
  });

  it('should be able to parse and use sub tempates', function () {
    var childTemplate = "<script id=\"inner\" type=\"text/x-jsrender\">{{:#data}}</script>";
    var template = "{{for items tmpl=\"inner\"}}{{/for}}";
    var html = jsrender(childTemplate + template)(null, { items: [1, 2, 3] });
    html.should.be.eql("123");
  });

  it('should be able to parse and use multiple sub tempates', function () {
    var childTemplate = "<script id=\"inner\" type=\"text/x-jsrender\">{{:#data}}</script>\n<script id=\"inner2\" type=\"text/x-jsrender\">a{{:#data}}</script>";
    var template = "{{for items tmpl=\"inner\"}}{{/for}}{{for items tmpl=\"inner2\"}}{{/for}}";
    var html = jsrender(childTemplate + template)(null, { items: [1, 2, 3] });
    html.should.be.eql("\n123a1a2a3");
  });

  it('should be able to use custom tag', function () {
    var html = jsrender("{{customTag}}{{:a}}{{/customTag}}")({
      customTag: function () {
        return this.tagCtx.render(this.tagCtx.view.data)
      }
    }, { a: "Hey" });
    html.should.be.eql("Hey");
  });

  it('should be able to use custom tag inside for loop', function () {
    var html = jsrender("{{for people}}{{customTag}}{{:name}}{{/customTag}}{{/for}}")({
      customTag: function () {
        return this.tagCtx.render(this.tagCtx.view.data)
      }
    }, { people: [{ name: "Jan" }] });
    html.should.be.eql("Jan");
  });

  it('should clean tags after render', function () {
    jsrender("{{customTag}}{{:a}}{{/customTag}}")({
      customTag: function () {
        return this.tagCtx.render(this.tagCtx.view.data) + 'x'
      }
    }, { a: "Heyx" });

    var html = jsrender("{{customTag}}{{:a}}{{/customTag}}")({}, { a: "Hey" });

    html.should.not.be.eql("Heyx");

  });
});
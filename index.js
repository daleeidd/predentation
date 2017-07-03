///////////////////////////////////////////////////////////////////////////////
//
// PREDENTATION
//
///////////////////////////////////////////////////////////////////////////////

'use strict';

var cheerio = require('cheerio');
var through = require('through2');
var onlyTag = /^\s*<\/?\w[^>]+>\s*$/;

module.exports = (function () {
  return function () {
    var data = '';
    return through(function (chunk, encoding, callback) {
      data += chunk.toString();
      var $ = cheerio.load(data, { decodeEntities: false });
      $('pre').each(function (index, pre) {

        var level = null;
        var lines = $(pre).html().split('\n');

        // Do not process single line pre elements
        if (lines.length === 1) {
          return;
        }

        // Determine the level of indentation
        lines.forEach(function (line) {
          // Ignore lines with only a markup tag
          if (line.match(onlyTag)) {
            return;
          }

          // Ignore lines with only whitespace
          if (line.match(/[^\s]+/)) {
            var current = (line.match(/^\s+/) !== null) ? line.match(/^\s+/)[0].length : 0;
            level = (level === null || level === 0) ? current : (current < level) ? current : level;
          }
        });

        // Remove indentation
        lines.forEach(function (line, index, lines) {
          // Ignore lines with only a markup tag
          if (line.match(onlyTag)) {
            return;
          }
          lines[index] = line.replace(new RegExp('^\\s{' + level + '}'), '');
        });

        $(pre).text(lines.join('\n'));
      });

      this.push($.html());

      callback();
    });
  };
}());

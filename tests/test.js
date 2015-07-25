'use strict';


///////////////////////////////////////////////////////////////////////////////
//
// IMPORTS
//
///////////////////////////////////////////////////////////////////////////////


var expect   = require('chai').expect;
var fs       = require('fs');
var path     = require('path');
var compare  = require('stream-equal');

var predentation = require('..');


///////////////////////////////////////////////////////////////////////////////
//
// UTILITIES
//
///////////////////////////////////////////////////////////////////////////////


var fixtures = function (number) {
  var fixtures = path.join(__dirname, 'fixtures', number < 10 ? '0' + number : number.toString());
  return {
    input:    path.join(fixtures, 'input.html'),
    expected: path.join(fixtures, 'output.html'),
    output:   path.join(fixtures, 'test-output.html')
  };
};

var evaluate = function (number) {
  return function (done) {
    var fixture = fixtures(number);
    fs.createReadStream(fixture.input)
    .pipe(predentation())
    .pipe(fs.createWriteStream(fixture.output))
    .on('finish', function () {
      compare(fs.createReadStream(fixture.expected), fs.createReadStream(fixture.output), function (error, equal) {
        if (equal) {
          fs.unlink(fixture.output);
        }
        expect(equal).to.be.true();
        done();
      });
    });
  };
};


///////////////////////////////////////////////////////////////////////////////
//
// TESTS
//
///////////////////////////////////////////////////////////////////////////////


describe('predentation', function () {

  var fixture = 1;

  it('should remove indentation for wellformed pre tag',           evaluate(fixture++));
  it('should not change indentation for already undented pre tag', evaluate(fixture++));
  it('should base indentation on least indented content',          evaluate(fixture++));
  it('should ignore concise pre tags',                             evaluate(fixture++));
  it('should remove indentation for mixed tag style',              evaluate(fixture++));
  it('should handle mixed content',                                evaluate(fixture++));
  it('should ignore inline pre tags',                              evaluate(fixture++));
  it('should handle malformed pre tags',                           evaluate(fixture++));
  it('should handle <code><pre> tag combination',                  evaluate(fixture++));
  it('should handle <pre><code> tag combination',                  evaluate(fixture++));
  it('should handle a complicated example',                        evaluate(fixture++));

});

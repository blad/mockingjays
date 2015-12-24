var expect = require('chai').expect;
var Util = require('../src/util');


describe('Util Functions', function() {

  describe('determinePort', function() {

    it('should be 80 when not https and no port is defined', function () {
      expect(Util.determinePort({protocol: 'http:'})).to.equal(80)
    });

    it('should be 443 when https and no port is defined', function () {
      expect(Util.determinePort({protocol: 'https:'})).to.equal(443)
    });

    it('should be the port defined in the URL regardless of protocol', function () {
      expect(Util.determinePort({port: 8080, protocol: 'http'})).to.equal(8080)
      expect(Util.determinePort({port: 8080, protocol: 'https'})).to.equal(8080)
    });
  });

  describe('parseJSON', function () {
    it('should parse valid json', function () {
      var exampleString = '{"example": "string value", "example2": 1, "example": [1, "abc"]}';
      expect(Util.parseJSON(exampleString)).to.deep.equal({
        example: 'string value',
        example2: 1,
        example: [1, 'abc']
      });
    });

    it('should return the string value of a failed parse attempt', function () {
      var exampleString = 'Exception occurred on server. Unable to process request.';
      expect(Util.parseJSON(exampleString)).to.deep.equal(exampleString);
    });
  });


  describe('stringify', function () {
    it('Stringify JSON', function () {
      var exampleString = JSON.stringify(JSON.parse('{"example": "string value", "example2": 1, "example": [1, "abc"]}'), null, 2);

      expect(Util.stringify({
        example: 'string value',
        example2: 1,
        example: [1, 'abc']
      })).to.equal(exampleString);
    });

    it('should return the string if a string is provided', function () {
      var exampleString = 'string-example';
      expect(Util.stringify(exampleString)).to.equal(exampleString);
    });

    it('should return the string if a number is provided', function () {
      var exampleString = '123';
      expect(Util.stringify(123)).to.equal(exampleString);
    });

    it('should call toString if a function is provided', function () {
      var exampleFunction = function(){};
      expect(Util.stringify(exampleFunction)).to.equal('[Function]');
    });

    it('should call toString if a circular reference exception is encountered', function () {
      var circularObject = {};
      circularObject.cycle = circularObject
      expect(Util.stringify(circularObject)).to.equal('[object Object]');
    });
  });


  describe('simpleCopy', function () {
    it('should provide a copy of an object', function () {
      var exampleObject = {
        abc: 123,
        def: 456
      };
      var copy = Util.simpleCopy(exampleObject);
      expect(copy).to.deep.equal(exampleObject); // Equals

      copy.abc = 987;
      copy.ghi = 755;
      expect(copy).to.deep.not.equal(exampleObject); // does not Share Object
    });
  });


  describe('regExArrayContains', function () {
    it('should match the value against a pattern', function () {
      var regExList = ['image/.*', 'text/.*', 'application/json'];
      var examples = ['image/png', 'image/jpg', 'text/plain', 'text/html', 'application/json'];
      examples.forEach(function (example) {
        expect(Util.regExArrayContains(regExList, example)).to.be.true
      });
    });

    it('should fail to match the value when pattern does not match', function () {
      var regExList = ['image/.*', 'text/.*'];
      var examples = ['application/json', 'application/image', 'plain/text'];
      examples.forEach(function (example) {
        expect(Util.regExArrayContains(regExList, example)).to.be.false
      });
    });
  });
});

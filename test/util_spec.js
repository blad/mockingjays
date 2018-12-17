import { expect } from 'chai';
import Util from '../src/util';


describe('Util Functions', function () {

  describe('determinePort', function () {

    it('should be 80 when not https and no port is defined', function () {
      expect(Util.determinePort({ protocol: 'http:' })).to.equal(80);
    });

    it('should be 443 when https and no port is defined', function () {
      expect(Util.determinePort({ protocol: 'https:' })).to.equal(443);
    });

    it('should be the port defined in the URL regardless of protocol', function () {
      expect(Util.determinePort({ port: 8080, protocol: 'http' })).to.equal(8080);
      expect(Util.determinePort({ port: 8080, protocol: 'https' })).to.equal(8080);
    });
  });

  describe('parseJSON', function () {
    it('should parse valid json', function () {
      let exampleString = '{"example": "string value", "example2": 1, "example": [1, "abc"]}';
      expect(Util.parseJSON(exampleString)).to.deep.equal({
        example: [1, 'abc'],
        example2: 1
      });
    });

    it('should return the string value of a failed parse attempt', function () {
      let exampleString = 'Exception occurred on server. Unable to process request.';
      expect(Util.parseJSON(exampleString)).to.deep.equal(exampleString);
    });
  });


  describe('stringify', function () {
    it('Stringify JSON', function () {
      let exampleString = JSON.stringify(JSON.parse('{"example": "string value", "example2": 1, "example": [1, "abc"]}'), null, 2);

      expect(Util.stringify({
        example: [1, 'abc'],
        example2: 1
      })).to.equal(exampleString);
    });

    it('should return the string if a string is provided', function () {
      let exampleString = 'string-example';
      expect(Util.stringify(exampleString)).to.equal(exampleString);
    });

    it('should return the string if a number is provided', function () {
      let exampleString = '123';
      expect(Util.stringify(123)).to.equal(exampleString);
    });

    it('should call toString if a function is provided', function () {
      let exampleFunction = function () {};
      expect(Util.stringify(exampleFunction)).to.equal('[Function]');
    });

    it('should call toString if a circular reference exception is encountered', function () {
      let circularObject = {};
      circularObject.cycle = circularObject;
      expect(Util.stringify(circularObject)).to.equal('[object Object]');
    });
  });


  describe('simpleCopy', function () {
    it('should provide a copy of an object', function () {
      let exampleObject = {
        abc: 123,
        def: 456
      };
      let copy = Util.simpleCopy(exampleObject);
      expect(copy).to.deep.equal(exampleObject); // Equals

      copy.abc = 987;
      copy.ghi = 755;
      expect(copy).to.deep.not.equal(exampleObject); // does not Share Object
    });
  });


  describe('regExArrayContains', function () {
    it('should match the value against a pattern', function () {
      let regExList = ['image/.*', 'text/.*', 'application/json'];
      let examples = ['image/png', 'image/jpg', 'text/plain', 'text/html', 'application/json'];
      examples.forEach(function (example) {
        expect(Util.regExArrayContains(regExList, example)).to.be.true;
      });
    });

    it('should fail to match the value when pattern does not match', function () {
      let regExList = ['image/.*', 'text/.*'];
      let examples = ['application/json', 'application/image', 'plain/text'];
      examples.forEach(function (example) {
        expect(Util.regExArrayContains(regExList, example)).to.be.false;
      });
    });
  });
});

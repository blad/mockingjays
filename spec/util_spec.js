var expect = require('chai').expect;
var Util = require('../src/util');


describe('Util Functions', function() {
  
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

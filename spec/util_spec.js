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
});

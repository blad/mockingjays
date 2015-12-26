var expect = require('chai').expect;
var Logger = require('../src/logger');


describe('Logger', function() {
  describe('formatLines', function() {
    it('should correctly format single lines', function() {
      expect(new Logger().formatLines(['abc', 'bcd', 'efg'])).to.deep.equal(['abc', 'bcd', 'efg']);
    })

    it('should correctly format multiline strings', function() {
      expect(new Logger().formatLines(['abc', 'bcd', 'e\nf\ng'])).to.deep.equal(['abc', 'bcd', 'e\n', '          f\n', '          g\n']);
    })
  })
})

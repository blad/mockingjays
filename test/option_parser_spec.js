var expect = require('chai').expect;
var OptionParser = require('../bin/option_parser');


describe('Option Parser', function() {

  describe('parse', function () {
    it('should return the string value of a failed parse attempt', function () {
      var exmapleArguments = [
        'node',
        'mockingjays',
        'serve',
        '--baseServerUrl=http://google.com',
        '--cacheDir=/var/temp/fixtures'
      ]

      var expectedOptions = {
        serve: true,
        baseServerUrl: 'http://google.com',
        cacheDir: '/var/temp/fixtures'
      };
      expect(OptionParser.parse(exmapleArguments)).to.deep.equal(expectedOptions);
    });


    it('should detect when the help menu should be displayed',function(){
      expect(OptionParser.shouldDisplayHelp({})).to.be.true;
      expect(OptionParser.shouldDisplayHelp({'help': true})).to.be.true;
      expect(OptionParser.shouldDisplayHelp({'serve': true})).to.be.false;
      expect(OptionParser.shouldDisplayHelp({'version': true})).to.be.false;
    });


    it('should detect when the version number should be displayed',function(){
      expect(OptionParser.shouldDisplayVersion({'version': true})).to.be.true;
      expect(OptionParser.shouldDisplayVersion({'serve': true})).to.be.false;
      expect(OptionParser.shouldDisplayVersion({})).to.be.false;
    });


    it('should detect when the we should rehash',function(){
      expect(OptionParser.shouldRehash({'rehash': true})).to.be.true;
      expect(OptionParser.shouldRehash({'serve': true})).to.be.false;
      expect(OptionParser.shouldRehash({'version': true})).to.be.false;
      expect(OptionParser.shouldRehash({'help': true})).to.be.false;
      expect(OptionParser.shouldRehash({})).to.be.false;
    });


    it('should detect when the we should serve',function(){
      expect(OptionParser.shouldServe({'serve': true})).to.be.true;
      expect(OptionParser.shouldServe({'rehash': true})).to.be.false;
      expect(OptionParser.shouldServe({'version': true})).to.be.false;
      expect(OptionParser.shouldServe({'help': true})).to.be.false;
      expect(OptionParser.shouldServe({})).to.be.false;
    });


    it('should detect when a primary function is not defined',function(){
      var exampleInvalidOptions = {invalid: true}
      expect(OptionParser.shouldRehash(exampleInvalidOptions)).to.be.false;
      expect(OptionParser.shouldServe(exampleInvalidOptions)).to.be.false;
      expect(OptionParser.shouldDisplayVersion(exampleInvalidOptions)).to.be.false;
      expect(OptionParser.shouldDisplayHelp(exampleInvalidOptions)).to.be.false;
    });
  });
});

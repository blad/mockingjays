import {expect} from 'chai';
import OptionParser from '../bin/option_parser';


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
        command: 'serve',
        baseServerUrl: 'http://google.com',
        cacheDir: '/var/temp/fixtures'
      };
      expect(OptionParser.parse(exmapleArguments)).to.deep.equal(expectedOptions);
    });


    it('should detect when the help menu should be displayed',function(){
      expect(OptionParser.shouldDisplayHelp({})).to.be.ok;
      expect(OptionParser.shouldDisplayHelp({command: 'help'})).to.be.ok;
      expect(OptionParser.shouldDisplayHelp({command: 'serve'})).to.not.be.ok;
      expect(OptionParser.shouldDisplayHelp({command: 'version'})).to.not.be.ok;
    });


    it('should detect when the version number should be displayed',function(){
      expect(OptionParser.shouldDisplayVersion({command: 'version'})).to.be.ok;
      expect(OptionParser.shouldDisplayVersion({command: 'serve'})).to.not.be.ok;
      expect(OptionParser.shouldDisplayVersion({})).to.not.be.ok;
    });


    it('should detect when the we should rehash',function(){
      expect(OptionParser.shouldRehash({command: 'rehash'})).to.be.ok;
      expect(OptionParser.shouldRehash({command: 'serve'})).to.not.be.ok;
      expect(OptionParser.shouldRehash({command: 'version'})).to.not.be.ok;
      expect(OptionParser.shouldRehash({command: 'help'})).to.not.be.ok;
      expect(OptionParser.shouldRehash({})).to.not.be.ok;
    });


    it('should detect when the we should serve',function(){
      expect(OptionParser.shouldServe({command: 'serve'})).to.be.ok;
      expect(OptionParser.shouldServe({command: 'otherOption'})).to.be.ok;
      expect(OptionParser.shouldServe({})).to.not.be.ok; // Should display help when empty
      expect(OptionParser.shouldServe({command: 'rehash'})).to.not.be.ok;
      expect(OptionParser.shouldServe({command: 'version'})).to.not.be.ok;
      expect(OptionParser.shouldServe({command: 'help'})).to.not.be.ok;
    });
  });
});

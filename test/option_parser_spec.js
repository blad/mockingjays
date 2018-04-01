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
      expect(OptionParser.shouldDisplayHelp({})).to.be.truthy;
      expect(OptionParser.shouldDisplayHelp({command: 'help'})).to.be.truthy;
      expect(OptionParser.shouldDisplayHelp({command: 'serve'})).to.be.falsey;
      expect(OptionParser.shouldDisplayHelp({command: 'version'})).to.be.falsey;
    });


    it('should detect when the version number should be displayed',function(){
      expect(OptionParser.shouldDisplayVersion({command: 'version'})).to.be.truthy;
      expect(OptionParser.shouldDisplayVersion({command: 'serve'})).to.be.falsey;
      expect(OptionParser.shouldDisplayVersion({})).to.be.falsey;
    });


    it('should detect when the we should rehash',function(){
      expect(OptionParser.shouldRehash({command: 'rehash'})).to.be.truthy;
      expect(OptionParser.shouldRehash({command: 'serve'})).to.be.falsey;
      expect(OptionParser.shouldRehash({command: 'version'})).to.be.falsey;
      expect(OptionParser.shouldRehash({command: 'help'})).to.be.falsey;
      expect(OptionParser.shouldRehash({})).to.be.falsey;
    });


    it('should detect when the we should serve',function(){
      expect(OptionParser.shouldServe({command: 'serve'})).to.be.truthy;
      expect(OptionParser.shouldServe({command: 'otherOption'})).to.be.truthy;
      expect(OptionParser.shouldServe({})).to.be.falsey; // Should display help when empty
      expect(OptionParser.shouldServe({command: 'rehash'})).to.be.falsey;
      expect(OptionParser.shouldServe({command: 'version'})).to.be.falsey;
      expect(OptionParser.shouldServe({command: 'help'})).to.be.falsey;
    });
  });
});

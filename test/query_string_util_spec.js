import {expect} from 'chai';
import {filterQueryParameters} from '../src/query_string_util';

describe('QueryStringUtil', function() {
  describe('filterQueryParameters', function() {
    const path = 'https://520.com/suhhhhh?toke=5&smoke=true&bloke=charles';
    const pathWithoutQueryParameters = 'https://520.com/suhhhhh';
    const filteredPath = 'https://520.com/suhhhhh?bloke=charles';

    describe('when there is no blacklist provided', function() {
      it('returns the path without changes', function() {
        expect(filterQueryParameters(null, path)).to.equal(path);
      });
    });

    describe('when there are no query parameters in the path', function() {
      it('returns the path without changes', function() {
        expect(filterQueryParameters('a,b', 'https://theprophets.com'))
          .to.equal('https://theprophets.com');
      });
    });

    describe('when all query parameters are blacklisted', function() {
      it('returns the path without the query parameters', function() {
        expect(filterQueryParameters('toke,smoke,bloke', path))
          .to.equal(pathWithoutQueryParameters);
      });
    });

    describe('when some query parameters are filtered', function() {
      it('returns the path with the remaining query parameters', function() {
        expect(filterQueryParameters('smoke,toke', path))
          .to.equal(filteredPath);
      });
    });
  });
});

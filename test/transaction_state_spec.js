var expect = require('chai').expect;
var TransactionState = require('../src/transaction_state');


describe('TransactionState', function() {

  describe('get and set', function() {
    var transactionConfig = {
      "/api/": {
        "method": "GET",
        "status": 200,
        "links": [
          {
            "path": "/api/people/1/",
            "method": "GET"
          }
        ]
      }
    }
    var transactionState = new TransactionState(transactionConfig);

    it('should identify stateful transaction', function () {
      expect(transactionState.isStateful('/api/', 'GET')).to.be.true;
      // The following are considered non-stateful, since they are not
      // part of the transaction config.
      expect(transactionState.isStateful('/api/', 'POST')).to.be.false;
      expect(transactionState.isStateful('/api/', 'PUT')).to.be.false;
      expect(transactionState.isStateful('/api/', 'DELETE')).to.be.false;
    });


    it('should return an empty value when no value is set', function () {
      expect(transactionState.get('/api/', 'GET')).to.equal('');
      expect(transactionState.get('/api/people/1/', 'GET')).to.equal('');
      expect(transactionState.get('/unlisted/path', 'GET')).to.equal('');
    });

    it('should return the key for a stateful transaction', function () {
      var expectedKey = 'abcd1234beef';
      transactionState.set('/api/', 'GET', expectedKey);

      expect(transactionState.get('/api/people/1/', 'GET')).to.equal(expectedKey);
      expect(transactionState.get('/api/people/1/', 'POST')).to.equal('');

      expect(transactionState.get('/unlisted/path', 'GET')).to.equal('');
      expect(transactionState.get('/unlisted/path')).to.equal('');
    });

  });
});

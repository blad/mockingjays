var expect = require('chai').expect;
var FormDataHandler = require('../src/form_data');


describe('Form Data Handler', function () {

  describe('isFormData', function () {
    it('should return true for form content-type', function () {
      var actualResult = FormDataHandler.isFormData({
        'content-type': 'multipart/form-data'
      });
      expect(actualResult).to.be.ok
    });

    it('should return false for non-form content types', function () {
      actualResult = FormDataHandler.isFormData({
        'content-type': 'application/json'
      });

      expect(actualResult).to.not.be.ok
    });
  });


  describe('updateBoundary', function () {
    it('should update the boundary for a form content-type', function () {
      var request = {
        headers:{
          'content-type': "multipart/form-data; boundary=\"----test123\""
        },
        body: "----test123\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n----test123--\r\n"
      }

      var newRequest = FormDataHandler.updateBoundary(request);

      expect(newRequest).to.deep.equal({
        headers: {
          "content-type": "multipart/form-data; boundary=\"----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49\""
        },
        body: "----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49--\r\n"
      });
    });


    it('should update the boundary for a form content-type without quotes', function () {
      var request = {
        headers:{
          'content-type': "multipart/form-data; boundary=----quoteless123"
        },
        body: "----quoteless123\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n----quoteless123--\r\n"
      }

      var newRequest = FormDataHandler.updateBoundary(request);

      expect(newRequest).to.deep.equal({
        headers: {
          "content-type": "multipart/form-data; boundary=----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49"
        },
        body: "----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n----mockingjaysfab375ff1a91ed0cbb274812f35df27e53e6be49--\r\n"
      });
    });


    it('should not update the boundary for a form content-type', function () {
      var request = {
        headers:{
          'content-type': "application/json"
        },
        body: {
          field: 'value'
        }
      }

      var newRequest = FormDataHandler.updateBoundary(request);

      expect(newRequest).to.deep.equal(request);
    });
  });
});

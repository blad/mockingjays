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
          'content-type': "multipart/form-data; boundary=\"--test123\""
        },
        body: "----test123\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n----test123--\r\n"
      }

      var newRequest = FormDataHandler.updateBoundary(request);

      expect(newRequest).to.deep.equal({
        headers: {
          "content-type": "multipart/form-data; boundary=\"----mockingjays63dc8a91ab42ae19780e1f7d97d15ed8799271f4\""
        },
        body: "------mockingjays63dc8a91ab42ae19780e1f7d97d15ed8799271f4\r\nContent-Disposition: form-data; name=\"file\"; filename=\"valid-file.csv\"\r\nContent-Type: application/octet-stream\r\n\r\nsample-data\r\n------mockingjays63dc8a91ab42ae19780e1f7d97d15ed8799271f4--\r\n"
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

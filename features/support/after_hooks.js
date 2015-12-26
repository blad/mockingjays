module.exports = function () {
  this.After(function (scenario) {
    // Clean Up After Every Scenario:
    if (this.mockingjay) {
      this.mockingjay.close();
      this.mockingjay = undefined;
    }
    this.options = undefined;
    this.error = undefined;
  });
};

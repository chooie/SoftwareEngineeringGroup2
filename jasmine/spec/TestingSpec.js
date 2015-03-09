/// <reference path="../Home.js" />
// Testing grounds //
describe("testing for getExchangeRate", function() {
  var home = window.CurrencyConverter.home || {};
  var value;
  var tenSeconds = 10000;
  beforeEach(function(done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = tenSeconds;
    value = home.getExchangeRate("USD", "EUR");
    done();
  });

  it("takes a long time", function(done) {
    setTimeout(function() {
      expect(value).toBeGreaterThan(0);
      done();
    }, (tenSeconds) - 1);
  });
});
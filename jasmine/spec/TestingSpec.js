/// Testing grounds //
/*describe("testing for getExchangeRate", function() {
  //var h = window.CurrencyConverter.home || {};
  window.CurrencyConverter = window.CurrencyConverter || {};
  var h = window.CurrencyConverter;
  var value;
  var tenSeconds = 10000;
  beforeEach(function(done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = tenSeconds;
    value = h.home.getExchangeRate("USD", "EUR");
    done();
  });

  it("takes a long time", function(done) {
    setTimeout(function() {
      console.log("ah here " + h.home.noFinished);
      expect(value).toBeGreaterThan(0);
      done();
    }, (tenSeconds) - 1);
  });
});*/

(function() {
  var home = window.CurrencyConverter.home;

  /**
   * validateCurrencyCodesTest
   * test for Home/validateCurrencyCodes()
   *
   * @param {string} fromCurrency the currency being changed from
   * @param {string} toCurrency the currency being changed to
   * @returns {boolean} true if both currency codes are valid
   *                    false if one or both codes are invalid
   */
  describe("validateCurrencyCodesTest", function() {
    it("tests the validateCurrencyCodes function with two valid codes",
        function() {
      expect(home.validateCurrencyCodes("USD", "EUR")).toBeTruthy();
    });
    it("testing",
       function() {
      expect(home.noFinished).toBeDefined();
    });
  });
}());
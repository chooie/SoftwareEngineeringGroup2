(function() {
  var home = window.CurrencyConverter.home;
  /**
   * getExchangeRateTest
   * test for Home/getExchangeRate()
   *
   * @param {string} fromCurrency the currency being changed from
   * @param {string} toCurrency the currency being changed to
   * @param {string} date the date to get the rate for
   * @returns {number} The exchange rate based on the parameters
   */
  describe("getExchangeRateTest", function() {
      it("tests if returned exchange rate is correct from US Dollars " + 
          "to Australian Dollars on the 26th of Febuary 2015", function() {
        expect(home.getExchangeRate("USD", "AUD", new Date())).toEqual(1.450);
      });
  });

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
        expect(home.validateCurrencyCodes
          ("USD", "EUR")).toBeTruthy();
      });
      it("tests the validateCurrencyCodes function with two valid codes",
         function() {
        expect(home.validateCurrencyCodes
          ("usd", "eur")).toBeTruthy();
      });
      it("tests the validateCurrencyCodes function with two valid codes", 
          function() {
        expect(home.validateCurrencyCodes
         ("UsD", "eUr")).toBeTruthy();
      });
      it("tests the validateCurrencyCodes function with one valid code", 
          function() {
        expect(home.validateCurrencyCodes
          ("xxx", "EUR")).toBeFalsy();
      });
      it("tests the validateCurrencyCodes function with one valid code", 
          function() {
        expect(home.validateCurrencyCodes
          ("USD", "xxx")).toBeFalsy();
      });
      it("tests the validateCurrencyCodes function with zero valid codes",
         function() {
        expect(home.validateCurrencyCodes
          ("xxx", "xxx")).toBeFalsy();
      });
  });
}());

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
    it("tests the validateCurrencyCodes function with two valid codes",
       function() {
      expect(home.validateCurrencyCodes("usd", "eur")).toBeTruthy();
    });
    it("tests the validateCurrencyCodes function with two valid codes", 
        function() {
      expect(home.validateCurrencyCodes("UsD", "eUr")).toBeTruthy();
    });
    it("tests the validateCurrencyCodes function with one valid code", 
        function() {
      expect(home.validateCurrencyCodes("xxx", "EUR")).toBeFalsy();
    });
    it("tests the validateCurrencyCodes function with one valid code", 
        function() {
      expect(home.validateCurrencyCodes("USD", "xxx")).toBeFalsy();
    });
    it("tests the validateCurrencyCodes function with zero valid codes",
       function() {
      expect(home.validateCurrencyCodes("xxx", "xxx")).toBeFalsy();
    });
  });

  /**
   * executeCellConversions
   * test for Home/validateCurrencyCodes()
   *
   * @param {string} fromCurrency the currency being changed from
   * @param {string} toCurrency the currency being changed to
   * @returns {boolean} true if both currency codes are valid
   *                    false if one or both codes are invalid
   */
  describe("executeCellConversions", function() {
    it("tests the executeCellConversions function with test data inside TestingSpec",
        function() {
      expect(home.executeCellConversions()).toBeTruthy();
    });
  });
}());
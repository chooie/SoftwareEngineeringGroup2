/**
 * getExchangeRateTest
 * test for Home/getExchangeRate()
 *
 * @param {string} fromCurrency the currency being changed from
 * @param {string} toCurrency the currency being changed to
 * @param {string} date the date to get the rate for
 * @returns {number} The exchange rate based on the parameters
 */
// TODO - when getExchangeRate is functional, implement tests
describe("getExchangeRateTest", function() {
    it("tests if returned exchange rate is correct", function() {
      expect(window.CurrencyConverter.home.getExchangeRate("USD", "EUR", "today")).toEqual(10);
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
      expect(window.CurrencyConverter.home.validateCurrencyCodes
        ("USD", "EUR")).toBeTruthy();
    });
    it("tests the validateCurrencyCodes function with two valid codes",
       function() {
      expect(window.CurrencyConverter.home.validateCurrencyCodes
        ("usd", "eur")).toBeTruthy();
    });
    it("tests the validateCurrencyCodes function with two valid codes", 
        function() {
      expect(window.CurrencyConverter.home.validateCurrencyCodes
       ("UsD", "eUr")).toBeTruthy();
    });
    it("tests the validateCurrencyCodes function with one valid code", 
        function() {
      expect(window.CurrencyConverter.home.validateCurrencyCodes
        ("xxx", "EUR")).toBeFalsy();
    });
    it("tests the validateCurrencyCodes function with one valid code", 
        function() {
      expect(window.CurrencyConverter.home.validateCurrencyCodes
        ("USD", "xxx")).toBeFalsy();
    });
    it("tests the validateCurrencyCodes function with zero valid codes",
       function() {
      expect(window.CurrencyConverter.home.validateCurrencyCodes
        ("xxx", "xxx")).toBeFalsy();
    });
});

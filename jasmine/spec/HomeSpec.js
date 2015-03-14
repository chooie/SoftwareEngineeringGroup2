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
   * convertValueTest
   * test for Home/convertValue()
   *
   * @param {string}   the cell query
   * @returns {int}    the value based on the query
   * @returns {string} the cell query
   */
  describe("convertValueTest", function() {
    /* valid queries */

    it("vaid test 1 for convertValue function for Case 1", function() {
      expect(home.convertValue("1", 0, 0)).toEqual(typeof "number");
    });    
    it("vaid test 2 for convertValue function for Case 1", function() {
      expect(home.convertValue("62.1167", 0, 0)).toEqual(typeof "number");
    });
    it("vaid test 3 fpr convertValue function for Case 1", function() {
      expect(home.convertValue(" 62.1167 ", 0, 0)).toEqual(typeof "number");
    });      

    it("vaid test 1 for convertValue function for Case 2", function() {
      expect(home.convertValue("2 USD EUR", 0, 0)).toEqual(typeof "number");
    });   
    it("vaid test 2 for convertValue function for Case 2", function() {
      expect(home.convertValue("62.1167 AUD EUR", 0, 0)).toEqual(typeof "number");
    }); 
    it("vaid test 3 for convertValue function for Case 2", function() {
      expect(home.convertValue("  62.1167   AUD   EUR  ", 0, 0)).toEqual(typeof "number");
    });   

    it("vaid test 1 for convertValue function for Case 3", function() {
      expect(home.convertValue("100 USD EUR 21-08-2002", 0, 0)).toEqual(typeof "string");
    });
    it("vaid test 2 for convertValue function for Case 3", function() {
      expect(home.convertValue("100 USD EUR 2-7-2010", 0, 0)).toEqual(typeof "string");
    });
    it("vaid test 3 for convertValue function for Case 3", function() {
      expect(home.convertValue("   100   USD   EUR   2-6-2010  ", 0, 0)).toEqual(typeof "number");
    });

    /* Invalid queries */
    it("invaid test 1 for convertValue function for Case 1", function() {
      expect(home.convertValue("-1", 0, 0)).toEqual(typeof "string");
    });    
    it("invaid test 2 forconvertValue function for Case 1", function() {
      expect(home.convertValue("t 62.1167", 0, 0)).toEqual(typeof "string");
    });
    it("invaid test 3 for convertValue function for Case 1", function() {
      expect(home.convertValue(" 62.1167  5", 0, 0)).toEqual(typeof "string");
    });      

    it("invaid test 1 for convertValue function for Case 2", function() {
      expect(home.convertValue("2  EUR USD EUR", 0, 0)).toEqual(typeof "string");
    });   
    it("invaid test 2 for convertValue function for Case 2", function() {
      expect(home.convertValue("Jimmy AUD EUR", 0, 0)).toEqual(typeof "string");
    }); 
    it("invaid test 3 for convertValue function for Case 2", function() {
      expect(home.convertValue("  62.11t67   AUD   EUR  ", 0, 0)).toEqual(typeof "string");
    });   

    it("invaid test 1 for convertValue function for Case 3", function() {
      expect(home.convertValue("100 USD EUR 21/08/2002")).toEqual(typeof "string");
    });
    it("invaid test 2 for convertValue function for Case 3", function() {
      expect(home.convertValue("100 USD EUR 2 7 2010", 0, 0)).toEqual(typeof "string");
    });
    it("invaid test 3 for convertValue function for Case 3", function() {
      expect(home.convertValue("   100   USD   EUR   2-2014  ", 0, 0)).toEqual(typeof "string");
    });
  });
}());

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
	var home = new Home();
    it("tests if returned exchange rate is correct", function() {
      expect(home.getExchangeRate("USD", "EUR", "today")).toEqual(10);
    });
});

describe("getExchangeRate test", function() {
    it("tests if returned exchange rate is correct", function() {
        expect(getExchangeRate("", "", "")).toEqual(10);
    });
});

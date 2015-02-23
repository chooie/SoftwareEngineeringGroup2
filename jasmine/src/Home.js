/// <reference path="../App.js" />
/// <reference path="../Scrapper.js" />

(function () {
    "use strict";
    var original,
    errorOccurred = false;

    original.getExchangeRate = function(fromCurrency, toCurrency, date) {
        return 10;
    };
    //window.getExchangeRate = getExchangeRate();
})();

//var exchangeRate = getExchangeRate();
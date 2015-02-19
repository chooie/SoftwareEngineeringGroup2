/**
 * Created by chooie on 11/02/2015.
 */

// Make sure the CurrencyConverter object exists and, if not, create it.
window.CurrencyConverter = window.CurrencyConverter || {};

(function($) {
  "use strict";
  $.parser = {
    urlSourceDaily: "http://www.ecb.europa.eu/stats/" +
    "eurofxref/eurofxref-daily.xml",
    urlSourceHistory: undefined,
    currencyDataDaily: undefined,
    //currencyDataHistory: this.fetchJSON(this.urlSourceHistory),

    /**
     *
     * @param results
     */
    handleResponse: function(results) {
      // Simply populate a div for the time being
      var demo = document.getElementById('demo'),
        currencies = results["query"]["results"]["Envelope"]["Cube"]["Cube"],
        jsonCurrencies = JSON.stringify(currencies);

      // TODO fix this
      // for some reason, 'this' refers to the prototype object
      $.parser.currencyDataDaily = jsonCurrencies;

      demo.innerHTML = (results.error ?
        "Internal Server Error!" : jsonCurrencies);
    },

    /**
     *
     * @param url
     */
    fetchJSON: function(url) {
      var root = 'https://query.yahooapis.com/v1/public/yql?q=',
        yql = 'select * from xml where url="' + url + '"',
        proxyUrl = root + encodeURIComponent(yql) +
          "&format=json&diagnostics=false&" +
          "callback=CurrencyConverter.Currency.parser.handleResponse",
        body = document.getElementsByTagName('body')[0];

      body.appendChild(this.createScriptNode(proxyUrl));
    },

    /**
     *
     * @param url
     * @returns {HTMLElement}
     */
    createScriptNode: function(url) {
      var script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', url);
      return script;
    },

    /**
     *
     * @returns {*}
     */
    getDailyCurrencyData: function() {
      //var timeoutID = setTimeout(function() {
      //  throw new Error("Server took too long.");
      //}, 5000);
      var that = this;

      if (typeof this.currencyDataDaily !== "object") {
        // Poll every second
        setTimeout(that.getDailyCurrencyData, 1000);
      } else {
        return this.currencyDataDaily
      }
    }
  };
  $.parser.fetchJSON($.parser.urlSourceDaily);
}(window.CurrencyConverter.Currency = window.CurrencyConverter.Currency || {}));

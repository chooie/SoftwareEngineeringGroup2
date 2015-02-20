/**
 * Created by chooie on 11/02/2015.
 */

// Make sure the CurrencyConverter object exists and, if not, create it.
window.CurrencyConverter = window.CurrencyConverter || {};

(function($) {
  "use strict";
  $.parser = {
    currencyDataDaily: null,
    currencyData90Days: null,
    currencyDataHistorical: null,

    /**
     * Handles the fetchJSONDaily call via YQL.
     * @param results
     */
    handleResponseDaily: function(results) {
      // Simply populate a div for the time being
      var demo = document.getElementById('demo'),
        //currencies = results["query"]["results"]["Envelope"]["Cube"]["Cube"],
        jsonCurrencies = JSON.stringify(results);

      $.parser.currencyDataDaily = jsonCurrencies;

      demo.innerHTML = (results.error ?
        "Internal Server Error!" : jsonCurrencies);
    },

    /**
     * Handles the fetchJSON90Days call via YQL.
     * @param results
     */
    handleResponse90Days: function(results) {
      $.parser.currencyData90Days = JSON.stringify(results);

    },

    /**
     * Handles the fetchJSONHistorical call via YQL.
     * @param results
     */
    handleResponseHistorical: function(results) {
      $.parser.currencyData90Days = JSON.stringify(results);
    },

    /**
     * Uses YQL to get the most up to date currency data for the day.
     */
    fetchJSONDaily: function() {
      var url = "http://www.ecb.europa.eu/stats/" +
          "eurofxref/eurofxref-daily.xml",
        root = 'https://query.yahooapis.com/v1/public/yql?q=',
        yql = 'select * from xml where url="' + url + '"',
        proxyUrl = root + encodeURIComponent(yql) +
          "&format=json&diagnostics=false&" +
          "callback=CurrencyConverter.Currency.parser.handleResponseDaily",
        body = document.getElementsByTagName('body')[0];

      body.appendChild(this.createScriptNode(proxyUrl));
    },

    /**
     * Uses YQL to get the currency data for the last 90 days.
     */
    fetchJSON90Days: function() {
      var url = "http://www.ecb.europa.eu/stats/eurofxref/" +
          "eurofxref-hist-90d.xml",
        root = 'https://query.yahooapis.com/v1/public/yql?q=',
        yql = 'select * from xml where url="' + url + '"',
        proxyUrl = root + encodeURIComponent(yql) +
          "&format=json&diagnostics=false&" +
          "callback=CurrencyConverter.Currency.parser.handleResponse90Days",
        body = document.getElementsByTagName('body')[0];

      body.appendChild(this.createScriptNode(proxyUrl));
    },

    /**
     * Uses YQL to get the historical currency data (going back to 1999).
     */
    fetchJSONHistorical: function() {
      var url = "http://www.ecb.europa.eu/stats/eurofxref/" +
          "eurofxref-hist.xml",
        root = 'https://query.yahooapis.com/v1/public/yql?q=',
        yql = 'select * from xml where url="' + url + '"',
        proxyUrl = root + encodeURIComponent(yql) +
          "&format=json&diagnostics=false&" +
          "callback=CurrencyConverter.Currency.parser.handleResponseHistorical",
        body = document.getElementsByTagName('body')[0];

      body.appendChild(this.createScriptNode(proxyUrl));
    },

    /**
     * Create a script node with a src attribute to some URL.
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
     * @returns {JSON}
     */
    getDailyCurrencyData: function() {
      return this.currencyDataDaily;
    },

    /**
     * @returns {JSON}
     */
    get90DaysCurrencyData: function() {
      return this.currencyData90Days;
    },

    /**
     * @returns {JSON}
     */
    getHistoricalCurrencyData: function() {
      return this.currencyDataHistorical;
    }
  };
  $.parser.fetchJSONDaily();
  $.parser.fetchJSON90Days();
  // TODO fetchJSONHistorical is returning null - need to fix this.
  // Probably an issue with YQL having to parse too much data.
  // Should set some sort of constraint on what data it needs to parse.
  //$.parser.fetchJSONHistorical();
}(window.CurrencyConverter.Currency = window.CurrencyConverter.Currency || {}));

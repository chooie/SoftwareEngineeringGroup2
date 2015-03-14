/// <reference path="../../App/App.js" />
/// <reference path="../../App/Scrapper.js" />
/// <reference path="../../App/Database/Database.js" />
(function() {
  "use strict";
        
  var validTestData = ["1", "62.1167", " 62.1167 ", "-1",
                  "2 USD EUR", "62.1167 AUD EUR", "  62.1167   AUD   EUR  ",
                  "100 USD EUR 21-08-2002", "100 USD EUR 2-7-2010", "   100   USD   EUR   2-6-2010  "];
  var invalidTestData = ["t 62.1167", " 62.1167  5", "2  EUR USD EUR", "Jimmy AUD EUR", "  62.11t67   AUD   EUR  ", 
                      "100 USD EUR 21/08/2002", "100 USD EUR 2 7 2010", "   100   USD   EUR   2-2014  100"];
  
  // Ensure Currency Converter is defined
  window.CurrencyConverter = window.CurrencyConverter || {};

  var noFinished,
    cc = window.CurrencyConverter,
    datepicker = cc.datepicker,
    database = cc.database,
    graph = cc.graph;

  noFinished = [];

  /**
   * Contains all methods used in the app
   */
  cc.home = {
    /**
     * getExchangeRate
     * Determine the exchange rate between two currencies for
     * the passed date
     *
     * @param {string} fromCurrency the currency being changed from
     * @param {string} toCurrency the currency being changed to
     * @param {string} date the date to get the rate for
     * @returns {number} The exchange rate based on the parameters
     */
    getExchangeRate: function (fromCurrency, toCurrency, date) {
      return database.updateRate(fromCurrency, toCurrency, date);
    },

    /**
     * validateCurrencyCodes
     * Determine whether user-entered currency codes are valid.
     * Used by the convertValue function to avoid code repetition.
     * All values in options DOM are assumed to be uppercase.
     *
     * @param {string} firstCode the from currency code from the user
     * @param {string} secondCode the to currency code from the user
     * @return {boolean} true if both codes valid
     *                   false if one code is not valid
     */
    validateCurrencyCodes: function(firstCode, secondCode) {
      var optionsDOM = $(".currency-selections:first").children(),
        fromSelectionIsValid = false,
        toSelectionIsValid = false,
        i;

      firstCode = firstCode.toUpperCase();
      secondCode = secondCode.toUpperCase();
      for (i = 0; i < optionsDOM.length; i++) {
        if (!fromSelectionIsValid &&
          optionsDOM[i].value === firstCode) {
          fromSelectionIsValid = true;
        }
        if (!toSelectionIsValid &&
          optionsDOM[i].value === secondCode) {
          toSelectionIsValid = true;
        }
        if (fromSelectionIsValid && toSelectionIsValid) {
          return true;
        }
      }
      return false;
    },

    /**
     * convertValue
     * Get the exchanged value. Can take multiple forms of
     * input from the user.
     *
     *    Valid Inputs;
     *
     *      *****NOTES:
     *        Numerical value can contain or omit decimal digits
     *        Trailing spaces are allowed
     *        Trailing spaces between values are not allowed
     *        Leading spaces shouldn't be allowed, need to check
     *     ******END NOTES
     *
     *      - Case 1: "100"
     *        -> Convert 100 of whatever currency is selected
     *           in the top drop down bar into whatever
     *           currency is in the bottom drop down bar based
     *           on the current date(today)
     *      - Case 2: "100 USD EUR"
     *        -> Convert 100 US Dollars into Euros based on
     *           the current date (today)
     *      - Case 3: "100 USD EUR "29-02-2004"
     *        -> Convert 100 US Dollars into Euros based on
     *           the passed date (29-02-2004 in this case)
     * TODO discuss implementing "... 29/02/2004" (different delimeters)
     *
     * @param {string} value the user entered query
     * @returns {number} The exchanged value
     */
    convertValue: function(value, i, j) {
      var valuesArray,
        rate,
        dateDetails;
      // Case 1: Just a single value in the cell
      if (typeof value === "number") {
        rate = this.getExchangeRate("EUR", "USD",
          "12-03-20015");
        if (rate === null) {
          noFinished.push([i, j]);
          return value;
        }
        return value * rate;
      }
      try {
        value = value.trim();
        valuesArray = value.split(" ");
        valuesArray[1] = valuesArray[1].toUpperCase();
        valuesArray[2] = valuesArray[2].toUpperCase();
        // Case 2: Cell value is in the 'special' format (e.g. 100 USD
        // GBP)
        if (/^\d+\.?\d*\s+[A-Z]{3}\s+[A-Z]{3}$/i.test(value)) {
          if (this.validateCurrencyCodes(valuesArray[1],
              valuesArray[2])) {
            rate = this.getExchangeRate(valuesArray[1],
              valuesArray[2], datepicker.getSelectedDate());
            if (typeof rate !== "number") {
              noFinished.push([i, j]);
              return value;
            }
            return valuesArray[0] * rate;
          }
        }
        // Case 3 TODO correct date format
        // This is going to be broken, need to change date format into
        // YYYY/MM/DD and convert that into a date object
        else if (/^\d+\.?\d*\s+[A-Z]{3}\s+[A-Z]{3}\s+\d?\d-\d?\d-\d{4}$/
            .test(value)) {
          dateDetails = valuesArray[3].split("-");
          if (this.validateCurrencyCodes(valuesArray[1],
              valuesArray[2])) {
            rate = this.getExchangeRate(
              valuesArray[1],
              valuesArray[2],
              new Date(dateDetails[2] + "/" +
              dateDetails[1] + "/" +
              dateDetails[0])
            );
            if (typeof rate !== "number") {
              noFinished.push([i, j]);
              return value;
            }
            return valuesArray[0] * rate;
          }
        }
        else {
          throw new "Invalid Parsed Data";
        }
      }
      catch(error) {
        console.log(error.message);
        return value;
      }
    },

    /**
     * executeCellConversions
     * method takes in 2D array representing the selected cells to perform
     * conversion operations on
     */
    executeCellConversions: function() {
      // iterate over 2D array converting each cell
      var i, 
        j;
      for (i = 0, j = 0; i < validTestData.length; i++) {
        validTestData[i][j] =
          cc.home.convertValue(validTestData[i][j], i, j);
      }
      cc.home.waitForQueue(validTestData);
      for (i = 0; i < noFinished.length; i++) {
        console.log(validTestData[i] + " = " + noFinished[i]);
        if (typeof noFinished[i] !== "number") {
          return false;
        }
      }
      noFinished = [];
      for (i = 0, j = 0; i < invalidTestData.length; i++) {
        validTestData[i][j] =
          cc.home.convertValue(invalidTestData[i][j], i, j);
      }
      cc.home.waitForQueue(invalidTestData);
      for (i = 0; i < noFinished.length; i++) {
        if (typeof noFinished[i] !== "string") {
          return false;
        }
      }
      return true;
    },

    waitForQueue: function(array) {
      var i;
      if (database.checkQueueFinished()) {
        for (i = 0; i < noFinished.length; i++) {
          array.value[noFinished[i][0]][noFinished[i][1]] =
            this.convertValue(
              array.value[noFinished[i][0]][noFinished[i][1]],
              noFinished[i][0], noFinished[i][1]
            );
        }
      }
      else {
        setTimeout(function() {
          cc.home.waitForQueue(array);
        }, 250); // 1/4 second
      }
    }
  }; // end of window.CurrencyConverter.home assignment
}());

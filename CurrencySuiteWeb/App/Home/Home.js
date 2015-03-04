﻿/// <reference path="../App.js" />
/// <reference path="../Scrapper.js" />
/// <reference path="../Database.js" />
(function() {
  "use strict";

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
     * databaseInit
     * Initiates and creates listeners for the database
     */
    databaseInit: function() {

      // Adding listeners
      $('#selectedFromCur').change(function() {
        database.updateRate(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
        database.updateGraph(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
      });

      $('#selectedToCur').change(function() {
        database.updateRate(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
        database.updateGraph(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
      });

      $('#swap').click(function() {
        database.updateRate(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
        database.updateGraph(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
      });

      $('#datepicker').change(function() {
        database.updateRate(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
        database.updateGraph(
          $('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate()
        );
      });
    },

    /**
     * swap
     * Swaps the selected value in the drop-down
     */
    swap: function() {
      var from = $("#selectedFromCur option:selected").index() + 1,
        to = $("#selectedToCur option:selected").index() + 1;

      $("#selectedToCur :nth-child(" + to + ")")
        .removeAttr('selected');

      $("#selectedFromCur:nth-child(" + from + ")")
        .removeAttr('selected');

      $("#selectedFromCur :nth-child(" + to + ")")
        .prop('selected', true);

      $("#selectedToCur :nth-child(" + from + ")")
        .prop('selected', true);
    },

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
    getExchangeRate: function(fromCurrency, toCurrency, date) {
      return database.updateRate(fromCurrency, toCurrency, date);
      // return rate;
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
      var optionsDOM = $(".curOptions:first").children(),
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
        rate = this.getExchangeRate($('#selectedFromCur').val(),
          $('#selectedToCur').val(),
          datepicker.getSelectedDate());
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
            if (rate === null) {
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
            if (rate === null) {
              noFinished.push([i, j]);
              return value;
            }
            return valuesArray[0] * rate;
          }
        }
      }
      catch(error) {
        console.log(error.message);
        app.showNotification("Warning", "Some data could not be " +
        "converted as it was not a valid number.");
        return value;
      }
    },

    /**
     * executeCellConversions
     * method takes in 2D array representing the selected cells to perform
     * conversion operations on
     */
    executeCellConversions: function() {
      // Retrieves values from excel
      Office.context.document.getSelectedDataAsync(
        Office.CoercionType.Matrix,
        {
          valueFormat: Office.ValueFormat.Unformatted,
          filterType: Office.FilterType.All
        },
        // The callback function
        function(asyncResult) {
          var i,
            j;

          if (asyncResult.status === "failed") {
            app.showNotification("Whoops",
              asyncResult.error.message);
            return;
          }
          // User is attempting to use convert whilst still inputting
          // into the cell
          if (asyncResult.value.length === 1 &&
            asyncResult.value[0][0] === "") {
            app.showNotification("Try Again",
              "Please re-select the data as it has not been " +
              "properly selected");
            return;
          }
          noFinished = [];
          database.setQueue(0);
          // iterate over 2D array converting each cell
          for (i = 0; i < asyncResult.value.length; i++) {
            for (j = 0; j < asyncResult.value[i].length; j++) {
              asyncResult.value[i][j] =
                cc.home.convertValue(
                  asyncResult.value[i][j],
                  i,
                  j
                );
            }
          }
          cc.home.waitForQueue(asyncResult);

          // Return values to excel
          //Office.context.document.setSelectedDataAsync(
          //  asyncResult.value
          //);

          // Display success message if no errors have occurred
          //if (!errorOccurred) {
          //  app.showNotification("Success",
          //  "Your currencies have successfully been converted!");
          //}
        } // end of callback
      );
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
        // Return values to excel
        Office.context.document.setSelectedDataAsync(
          array.value
        );
      }
      else {
        setTimeout(function() {
          cc.home.waitForQueue(array);
        }, 250); // 1/4 second
      }
    }
  }; // end of window.CurrencyConverter.home assignment

  /**
   * Handler that is executed when the app is loaded
   * Initializes app, app buttons and app utilities
   */
  Office.initialize = function() {
    $(document).ready(function() {
      app.initialize();
      $('#swap').click(cc.home.swap);
      $('#submit').click(cc.home.executeCellConversions);
      datepicker.initialize();
      graph.initialize();
      graph.update([[new Date("2015/12/1"), 1],
        [new Date("2015/12/2"), 1],
        [new Date("2015/12/3"), 1],
        [new Date("2015/12/4"), 1],
        [new Date("2015/12/5"), 1],
        [new Date("2015/12/6"), 1],
        [new Date("2015/12/7"), 1],
        [new Date("2015/12/8"), 1],
        [new Date("2015/12/9"), 1],
        [new Date("2015/12/10"), 1]]);
      cc.home.databaseInit();
    });
  };
}());

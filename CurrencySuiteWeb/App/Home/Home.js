﻿/// <reference path="../App.js" />
/// <reference path="../Scrapper.js" />

(function () {
    "use strict";
    var original,
    errorOccurred = false;
    /**
     * Handler that is executed when the app is loaded
     * Initializes app, app buttons and app utilities
     */
    Office.initialize = function () {
        $(document).ready(function () {
            app.initialize();
            $('#swap').click(swap);
            $('#submit').click(executeCellConversions);
            datepicker.initialize();

            scrapperInit();
        });
    };

    /**
    * scrapperInit
    * Initiates and creates listeners for the scrapper
    *
    */
    var scrapperInit = function () {
        scrapper.initialize();
        scrapper.updateRate(
            $('#selectedFromCur').val(),
            $('#selectedToCur').val(),
            scrapper.getDate()
        );
        // adding listeners
        $('#selectedFromCur').change(function () {
            scrapper.updateRate(
                $('#selectedFromCur').val(),
                $('#selectedToCur').val(),
                datepicker.getSelectedDate()
            )
        });
        $('#selectedToCur').change(function () {
            scrapper.updateRate(
                $('#selectedFromCur').val(),
                $('#selectedToCur').val(),
                datepicker.getSelectedDate()
            )
        });
        $('#swap').click(function () {
            scrapper.updateRate(
                $('#selectedFromCur').val(),
                $('#selectedToCur').val(),
                datepicker.getSelectedDate()
            )
        });
        $('#datepicker').change(function () {
            scrapper.updateRate(
                $('#selectedFromCur').val(),
                $('#selectedToCur').val(),
                datepicker.getSelectedDate()
            )
        });
    };

    /**
     * swap
     * Swaps the selected value in the drop-down
     *
     */
    var swap = function () {
        var from = $("#selectedFromCur option:selected").index() + 1;
        var to = $("#selectedToCur option:selected").index() + 1;
        $("#selectedToCur :nth-child(" + to + ")").removeAttr('selected');
        $("#selectedFromCur:nth-child(" + from + ")").removeAttr('selected');
        $("#selectedFromCur :nth-child(" + to + ")").prop('selected', true);
        $("#selectedToCur :nth-child(" + from + ")").prop('selected', true);
    };

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
    var getExchangeRate = function (fromCurrency, toCurrency, date) {
        // TODO make use of ECB xml docs
        return 10;
    };

    /**
     * validateCurrencyCodes
     * Determine whether user-entered currency codes are valid.
     * Used by the convertValue function to avoid code repetition. All values
     * in options DOM are assumed to be uppercase.
     * 
     * @param {string} firstCode the from currency code from the user
     * @param {string} secondCode the to currency code from the user
     * @return {boolean} true if both codes valid
     *                   false if one code is not valid
     */
    var validateCurrencyCodes = function(firstCode, secondCode) {
      var optionsDOM = $("option[value]"),
        fromSelectionIsValid = false,
        toSelectionIsValid = false;

      firstCode = firstCode.toUpperCase();
      secondCode = firstCode.toUpperCase();

      $(optionsDOM).each(function (index, element) {
        if (!fromSelectionIsValid &&
          element.value === firstCode) {
          fromSelectionIsValid = true;
        }
        if (!toSelectionIsValid &&
          element.value === secondCode) {
          toSelectionIsValid = true;
        }
        if (fromSelectionIsValid && toSelectionIsValid) {
          return true;
        }
      });
      return false;
    };

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
     * TODO discuss implementing "... 29-02" assumes this year
     * TODO discuss implementing "... 29/02/2004" (different delimeters)
     *
     * @param {string} value the user entered query
     * @returns {number} The exchanged value
     */
    var convertValue = function (value) {
      var valuesArray;
      // Remove whitespace at beginning and end of value
      value = value.trim();
      try {
        // Case 1: Just a single value in the cell
        if (/^\d+\.?\d*$/.test(value)) {
          return value * getExchangeRate($('#selectedFromCur').val(),
              $('#selectedToCur').val(), "today");
        }
        // Case 1: Cell value is in the 'special' format (e.g. 100 USD GBP)
        else if (/^\d+\.?\d*\s+[A-Z]{3}\s+[A-Z]{3}$/i.test(value)) {
          valuesArray = value.split(" ");
          valuesArray[1] = valuesArray[1].toUpperCase();
          valuesArray[2] = valuesArray[2].toUpperCase();
          if (validateCurrencyCodes(valuesArray[1], valuesArray[2])) {
            return valuesArray[0] * getExchangeRate(valuesArray[1],
                valuesArray[2], "today");
          }
          else {
            throw new Error("Error thrown for Case 2 in convertValue function");
          }
        }
        // Case 3
        else if (/^\d+\.?\d*\s+[A-Z]{3}\s+[A-Z]{3}\s+\d?\d-\d?\d-\d{4}$/
            .test(value)) {
          valuesArray = value.split(" ");
          valuesArray[1] = valuesArray[1].toUpperCase();
          valuesArray[2] = valuesArray[2].toUpperCase();
          if (validateCurrencyCodes(valuesArray[1], valuesArray[2])) {
            return valuesArray[0] * getExchangeRate(valuesArray[1], valuesArray[2], valuesArray[3]);
          }
          else {
            throw new Error("Error thrown for Case 3 in convertValue function");
          }
        }
        else {
          throw new Error("Invalid query entered");
        }  
      } 
      catch (error) {
        console.log(error.message);
        errorOccurred = true;
        app.showNotification("Warning", "Some data could not be converted as " +
        "it was not a valid number.");
        return value;
      }
    };

    /**
     * executeCellConversions
     * method takes in 2D array representing the selected cells to perform
     * conversion operations on
     */
    var executeCellConversions = function () {
      // Retrieves values from excel
      Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
      {
        valueFormat: Office.ValueFormat.Unformatted,
        filterType: Office.FilterType.All
      },
      // The callback function
      function (asyncResult) {
        if (asyncResult.status == "failed") {
          app.showNotification("Whoops", asyncResult.error.message);
          errorOccurred = true;
          return;
        }
        original = asyncResult.value[0][0];
        // User is attempting to use convert whilst still inputting into the cell
        if (asyncResult.value.length === 1 && asyncResult.value[0][0] === "") {
          app.showNotification("Try Again", "Please re-select the data as it " + 
                               "has not been properly selected");
          errorOccurred = true;
          return;
        }
        // iterate over 2D array converting each cell             
        for (var i = 0; i < asyncResult.value.length; i++) {
          for (var j = 0; j < asyncResult.value[i].length; j++)  {
            asyncResult.value[i][j] = convertValue(asyncResult.value[i][j]);
          }
        }
        // Return values to excel
        Office.context.document.setSelectedDataAsync(
          asyncResult.value
        );

        // Display success message if no errors have occurred
        if (!errorOccurred) {
          app.showNotification("Success", "Your currencies have successfully " +
          "been converted!");
        }
        errorOccurred = false;
      } // end of callback
    );
  };
})();
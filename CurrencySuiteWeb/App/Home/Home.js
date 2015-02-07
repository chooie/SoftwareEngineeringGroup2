/// <reference path="../App.js" />

(function () {
    "use strict";

    // Handler that is executed when the app is loaded
    Office.initialize = function () {
        $(document).ready(function () {
            app.initialize();
            // Initialize the swap button click listener
            $('#swap').click(swap);
            // Initialize the submit button click listener
            $('#submit').click(convert);
        });
    };

    /**
     * Swaps the selected value in the drop-down
     */
    var swap = function () {
        //gets indexes
        var from = $("#selectedFromCur option:selected").index() + 1;
        var to = $("#selectedToCur option:selected").index() + 1;

        //remove the current selections
        $("#selectedToCur :nth-child(" + to + ")").removeAttr('selected');
        $("#selectedFromCur:nth-child(" + from + ")").removeAttr('selected');

        //assign the new selections
        $("#selectedFromCur :nth-child(" + to + ")").prop('selected', true);
        $("#selectedToCur :nth-child(" + from + ")").prop('selected', true);
    };

    /**
     * Multiplies a number by some exchange rate value.
     * @param {number} value The initial number
     * @returns {number} The converted number
     */
    var convertValue = function (value, exchangeRate) {
        try {
            if (typeof value !== "number" || isNaN(value)) {
                throw new Error("convertValue(): parameter [0] is not of the number type. " +
                    typeof value + " given (" + value + ").");
            }

            if (typeof exchangeRate !== "number" || isNaN(value)) {
                throw new Error("convertValue(): parameter [1] is not of the number type. " +
                    typeof exchangeRate + " given (" + exchangeRate + ").");
            }
            // Later on use the real conversion rate
            // TODO
            return value * exchangeRate;
        } catch (error) {
            console.log(error.message);
            app.showNotification("Warning", "Some data could not be converted as it " +
                "was not a valid number.");
        }
    };

    /**
     * Convert?
     */
    var original;
    var convert = function () {
        // Retrieves values from excel
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Matrix,
          // Some optional parameters
          {
              valueFormat: Office.ValueFormat.Unformatted,
              filterType: Office.FilterType.All
          },
          // The callback function
          function (asyncResult) {
              // Temporary way of better informing the user of when they need to re-select
              // the data
              if (asyncResult.value.length === 1 && asyncResult.value[0][0] === original) {
                  app.showNotification("Whoops", "You gave us the same value as last time. " +
                      "Try re-selecting the cell.");
                  return;
              }
              original = asyncResult.value[0][0];
              // User is attempting to use convert whilst still inputting into the cell
              if (asyncResult.value.length === 1 && asyncResult.value[0][0] === "") {
                  app.showNotification("Try Again", "Please re-select the data as it " + 
                      "has not been properly selected");
                  return;
              }
              if (asyncResult.status == "failed") {
                  app.showNotification("Failed", asyncResult.error.message);
                  return;
              }
              // Hide error messages
              $('#notification-message').hide();

              // Gets current date (currently unused for anything)
              //var currentDate = new Date();
              //var datetime = "Last Sync: " + currentDate.getDate() + "/"
              //  + (currentDate.getMonth() + 1) + "/"
              //  + currentDate.getFullYear() + " @ "
              //  + currentDate.getHours() + ":"
              //  + currentDate.getMinutes() + ":"
              //  + currentDate.getSeconds();

              // .val is the value attribute, it is converted into a base 10 int
              //var fromCur = parseFloat($('#selectedFromCur').val());
              //var toCur = parseFloat($('#selectedToCur').val());

              // If only one cell is given (for some s***** reason it changes to
              // a number type if only one cell is selected, screw consistency...)
              if (typeof asyncResult.value == "number") {
                  asyncResult.value = convertValue(parseFloat(asyncResult.value), 2);
              }

              for (var i = 0; i < asyncResult.value.length; i++) {
                  for (var j = 0; j < asyncResult.value[i].length; j++) {
                      // Uses value of two currencies to get a result, returns NaN if
                      // can't parse
                      var cell = convertValue(parseFloat(asyncResult.value[i][j]), 2);
                      // NaN checks if a string isn't in a number format
                      if (!isNaN(cell)) {
                          // If it is a number then
                          asyncResult.value[i][j] = cell;
                      }
                  }
              }
              Office.context.document.setSelectedDataAsync(
                // Inserts a (possible) 2d array of values back into excel
                asyncResult.value
              );

              app.showNotification("Success", "Your currencies have successfully " +
                  "been converted!");
          } // end of callback
        );
    };
})();
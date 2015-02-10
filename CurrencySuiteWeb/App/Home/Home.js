/// <reference path="../App.js" />
/// <reference path="../Scrapper.js" />

(function () {
    "use strict";

    var original,
    errorOccurred = false;

    // Handler that is executed when the app is loaded
    Office.initialize = function () {
        $(document).ready(function () {
            app.initialize();
            // Initialize the swap button click listener
            $('#swap').click(swap);
            // Initialize the submit button click listener
            $('#submit').click(convert);
            // Initialize Scrapper
            scrapperInit();
            datepicker.initialize();
        });
    };


    /**
    * Initiates and creates listeners for the scrapper
    */
    var scrapperInit = function () {
        currentExchangeRate = 1; //a nice safe value
        scrapper.initialize(); //initalize the scrapper


        //update with the default rate
        scrapper.updateRate(
            $('#selectedFromCur').val(),
            $('#selectedToCur').val(),
            scrapper.getDate() //is going to have to be changed when the user can select a date
        );
        //adding listeners
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
    }
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
     * Determine the exchange rate between two currencies
     * @param {string} fromCurrency the currency being changed from
     * @param {string} toCurrency the currency being changed to
     * @param {string} date the date to get the rate for
     * @returns {number} The exchange rate based on the parameters
     */
    var getExchangeRate = function (fromCurrency, toCurrency, date) {
        // TODO
        return 10;
    };

    /**
     * Multiplies a number by some exchange rate value.
     * @param {number} value The initial number
     * @returns {number} The converted number
     */
    var convertValue = function (value) {
        try {
            //^\d = must start with digit, \d = one or more digits, \.? = zero or one decimal point, \d* = zero or more digits
            // \s+ = one or more spaces, \D{3} = 3 non-digits, \D{3}$ = 3 non-digits, $ means it must end with this
            if (/^\d+\.?\d*\s+\D{3}\s+\D{3}\s*$/.test(value)) {
                var valueArray = value.split(" ");
                //*NOTE* We're going to have to have a delay or something so the API/scrapper can get the exchange rates
                // need to make sure that input currencies are valid before conversion occurs
                var optionsDOMFrom = $("option[value]");
                var selectionFromValid = false;
                var selectionToValid = false;
                $(optionsDOMFrom).each(function (index, element) {
                    if (element.value === valueArray[1].toUpperCase()) {
                        selectionFromValid = true;
                    }
                    if (element.value === valueArray[2].toUpperCase()) {
                        selectionToValid = true;
                    }
                });
                if (selectionFromValid && selectionToValid) {
                    return valueArray[0] * getExchangeRate(valueArray[1], valueArray[2], "today");
                }
                else {
                    throw new Error("convertValue(): parameters are wrong. " +
                        typeof value + " given (" + value + ").");
                }
            }
            else if ((/^\d+\.?\d*\s*$/.test(value))) {
                //return value * getExchangeRate($('#selectedFromCur').val(), $('#selectedToCur').val(), "today");
                return value * currentExchangeRate;
            }
            //same as above but takes a date in the format dd-mm-yyyy 
            else if (/^\d+\.?\d*\s+\D{3}\s+\D{3}\s+\d?\d-\d?\d-\d{4}\s*$/.test(value)) {
                var valueArray = value.split(" ");
                // return will look something like;
                // return valueArray[0] * getExchangeRate(value[1], value[2]);
                //*NOTE* We're going to have to have a delay or something so the API/scrapper can get the exchange rates
                var optionsDOMFrom = $("option[value]");
                var selectionFromValid = false;
                var selectionToValid = false;
                $(optionsDOMFrom).each(function (index, element) {
                    if (element.value === valueArray[1].toUpperCase()) {
                        selectionFromValid = true;
                    }
                    if (element.value === valueArray[2].toUpperCase()) {
                        selectionToValid = true;
                    }
                });
                if (selectionFromValid && selectionToValid) {
                    return valueArray[0] * getExchangeRate(valueArray[1], valueArray[2], valueArray[3]);
                }
                else {
                    throw new Error("convertValue(): parameters are wrong. " +
                        typeof value + " given (" + value + ").");
                }
            }
            else {
                throw new Error("convertValue(): parameters are wrong. " +
                     typeof value + " given (" + value + ").");
            }
            
        } catch (error) {
            console.log(error.message);
            errorOccurred = true;
            app.showNotification("Warning", "Some data could not be converted as it " +
                "was not a valid number.");
            return value;
        }

    };

    /**
     * Convert?
     */
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
              if (asyncResult.status == "failed") {
                  app.showNotification("Whoops", asyncResult.value);
                  errorOccurred = true;
                  return;
              }
              // Temporary way of better informing the user of when they need to re-select
              // the data
              //disabled this if statement since it's annoying to debug with, uncomment it if you like
              //if (asyncResult.value.length === 1 && asyncResult.value[0][0] === original) {
              //    app.showNotification("Whoops", "You gave us the same value as last time. " +
              //        "Try re-selecting the cell.");
              //    errorOccurred = true;
              //    return;
              //}
              original = asyncResult.value[0][0];
              // User is attempting to use convert whilst still inputting into the cell
              if (asyncResult.value.length === 1 && asyncResult.value[0][0] === "") {
                  app.showNotification("Try Again", "Please re-select the data as it " + 
                      "has not been properly selected");
                  errorOccurred = true;
                  return;
              }

             
              // for each cell selected, calculate the new values
              // and prepare the insertion array
              for (var i = 0; i < asyncResult.value.length; i++) {
                  for (var j = 0; j < asyncResult.value[i].length; j++)  {
                    asyncResult.value[i][j] = convertValue(asyncResult.value[i][j]);
                  }
              }
              Office.context.document.setSelectedDataAsync(
                // Inserts a (possible) 2d array of values back into excel
                asyncResult.value
              );
              // Display success message if no errors have occurred
              if (!errorOccurred) {
                  //app.showNotification("Success", "Your currencies have successfully " +
                    //"been converted!");
              }
              errorOccurred = false;
          } // end of callback
        );
    };
})();
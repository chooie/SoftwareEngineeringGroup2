//this is for code that is currently unused but may be used in the future

//-------------------------------------------------------------

// Taken from executeCellConversion function
// Display success message if no errors have occurred
// if (!errorOccurred) {
// app.showNotification("Success", "Your currencies have successfully " +
// "been converted!");
// }
// errorOccurred = false;

//-------------------------------------------------------------

// Removed from executeCellConversion function
// Temporary way of better informing the user of when they need to re-select
// the data
//disabled this if statement since it's annoying to debug with, uncomment it if you like
//if (asyncResult.value.length === 1 && asyncResult.value[0][0] === original) {
//    app.showNotification("Whoops", "You gave us the same value as last time. " +
//        "Try re-selecting the cell.");
//    errorOccurred = true;
//    return;
//}

//-------------------------------------------------------------

//Unused but may be used later for reverting if scrapper fails
//oldFrom = $('#selectedFromCur option:selected').index() + 1;
//oldTo = $('#selectedToCur option:selected').index() + 1;
//$('#selectedFromCur').focus(function () {
//    oldFrom = $('#selectedFromCur').index() + 1;
//});
//$('#selectedToCur').focus(function () {
//    oldFrom = $('#selectedToCur').index() + 1;
//});

//-------------------------------------------------------------

// Gets current date (currently unused for anything)
//var currentDate = new Date();
//var datetime = "Last Sync: " + currentDate.getDate() + "/"
//  + (currentDate.getMonth() + 1) + "/"
//  + currentDate.getFullYear() + " @ "
//  + currentDate.getHours() + ":"
//  + currentDate.getMinutes() + ":"
//  + currentDate.getSeconds();

//-------------------------------------------------------------

// If only one cell is given (for some s***** reason it changes to
// a number type if only one cell is selected, screw consistency

//if (typeof asyncResult.value == "number") {
//     asyncResult.value = convertValue(parseFloat(asyncResult.value), 2);
//}

//-------------------------------------------------------------

//if (typeof value !== "number" || isNaN(value)) {
//   throw new Error("convertValue(): parameter [0] is not of the number type. " +
//        typeof value + " given (" + value + ").");
// }

//if (typeof currentExchangeRate !== "number" || isNaN(value)) {
//   throw new Error("convertValue(): currentExchangeRate is not of the number type. " +
//       typeof currentExchangeRate + " given (" + currentExchangeRate + ").");
//app.showNotification(value
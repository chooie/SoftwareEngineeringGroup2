var datepicker = (function() {

  var datepicker = {};
  // Common initialization function (to be called from each page)
  datepicker.initialize = function() {
    var dp = $("#datepicker");
    dp.datepicker();
    dp.datepicker("option", "showAnim", "slideDown");
    dp.datepicker("option", "dateFormat", "dd-mm-yy");
    dp.datepicker("option", "maxDate", "0");
    dp.datepicker("setDate", getToday());
    dp.datepicker("option", "showButtonPanel", true);

    datepicker.getSelectedDate = function() {
      return dp.datepicker("getDate");
    }
  };
  var getToday = function() {
    // Gets current date (currently unused for anything)
    var currentdate = new Date(); //gets current date
    return correctFormat(currentdate);
  };
  var correctFormat = function(date) {
    var datetime = addZero(date.getDate()) + "-"
      + addZero(date.getMonth() + 1) + "-"
      + date.getFullYear();
    return datetime;
  };
  var addZero = function(val) {
    if (val < 10) {
      return "0" + val;
    }
    return val;
  };
  return datepicker;
})();

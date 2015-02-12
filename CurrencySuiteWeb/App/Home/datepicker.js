var datepicker = (function () {


    var datepicker = {};
    // Common initialization function (to be called from each page)
    datepicker.initialize = function () {
        var datepicker = $("#datepicker");
        datepicker.datepicker();
        datepicker.datepicker("option", "showAnim", "slideDown");
        datepicker.datepicker("option", "dateFormat", "dd-mm-yy");
        datepicker.datepicker("option", "maxDate", "0");
        datepicker.datepicker("setDate", getToday());
        datepicker.datepicker("option", "showButtonPanel", true);

        datepicker.getSelectedDate = function () {
            var date = datepicker.datepicker("getDate");
            return correctFormat(date);
        }
    };
    var getToday = function () {
        // Gets current date (currently unused for anything)
        var currentdate = new Date(); //gets current date
        return correctFormat(currentdate);
    }
    var correctFormat = function (date) {
        var datetime = addZero(date.getDate()) + "-"
                       + addZero(date.getMonth() + 1) + "-"
                       + date.getFullYear();
        return datetime;
    }
    var addZero = function (val) {
        if (val < 10) {
            return "0" + val;
        }
        return val;
    }
    return datepicker;
})();
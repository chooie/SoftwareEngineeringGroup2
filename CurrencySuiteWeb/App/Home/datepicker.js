window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.datepicker = (function () {

    // Private Methods
    var addZero,
        correctFormat,
        getToday,
    // Public Methods
        initialize;

    addZero = function(val) {
        if (val < 10) {
            return "0" + val;
        }
        return val;
    };

    correctFormat = function (date) {
        var datetime = addZero(date.getDate()) + "-"
                       + addZero(date.getMonth() + 1) + "-"
                       + date.getFullYear();
        return datetime;
    };

    getToday = function () {
        return correctFormat(new Date());
    };

    // Common initialization function (to be called from each page)
    initialize = function () {
        var dp = $("#datepicker");
        dp.datepicker();
        dp.datepicker("option", "showAnim", "slideDown");
        dp.datepicker("option", "dateFormat", "dd-mm-yy");
        dp.datepicker("option", "maxDate", "0");
        dp.datepicker("setDate", getToday());
        dp.datepicker("option", "showButtonPanel", true);
    };

    return {
        initialize: initialize,
        getSelectedDate: function () {
            return $("#datepicker").datepicker("getDate");
        }
    };
}());

﻿/* Common app functionality */

var scrapper = (function () {


    var scrapper = {};

    // Common initialization function (to be called from each page)
    scrapper.initialize = function () {
        // After initialization, expose a common notification function
        scrapper.getDate = function () {
            var currentdate = new Date(); //gets current date
            var datetime = addZero(currentdate.getDate()) + "-"
                            + addZero(currentdate.getMonth() + 1) + "-"
                            + currentdate.getFullYear();
            return datetime;
        };
        scrapper.updateRate = function (from, to, date) { //example - scrapper.doAjax("USD", "EUR", "05-02-2015");
            getExchange(from, to, date);
        };
    };
    var getExchange = function (from, to, date) {
        //just incase something bad happens
        currentExchangeRate = 1;    
        $('#submit').prop('disabled', true); //disable button
        var url = "http://sdw.ecb.europa.eu/curConverter.do?sourceAmount=1.0&sourceCurrency=" + from + "&targetCurrency=" + to + "&inputDate=" + date + "&submitConvert.x=210&submitConvert.y=3";
        if (url.match('^http')) {
            // assemble the YQL call
            $.getJSON("https://query.yahooapis.com/v1/public/yql?" +
                      "q=select%20*%20from%20html%20where%20url%3D%22" +
                      encodeURIComponent(url) +
                      "%22&format=xml'&callback=?",

              function (data) {
                  if (data.results[0]) {
                      var object = $('<div/>').html(data.results).contents(); //converts string into jquery object containing html tags, etc
                      var parsed = object.find('[rowspan="2"]'); //will find three results
                      var val = parsed[2].innerText; //we want the 3rd result
                      result = parseFloat(val.split(" ")[0], 10); //turn   "1.23 EUR"  into 1.23
                      currentExchangeRate = result; //currently 
                  }
                  $('#submit').prop('disabled', false); //reenable button
              }
            );

        };
    }
    var addZero = function (val) {
        if (val < 10) {
            return "0" + val;
        }
        return val;
    }
    return scrapper;
})();


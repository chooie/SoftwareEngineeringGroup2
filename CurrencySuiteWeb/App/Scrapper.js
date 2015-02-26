/* Common app functionality */
/**
    Was created for testing purposes, currently unused
*/
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
    var cache = {};
    var getjson = null;
    var getExchange = function (from, to, date) {
        if (getjson != null) {
            getjson.abort(); //incase the user changes currency before the current request is complete
        }
        currentExchangeRate = 1;
        if (from == to) {
            return;
        }
        if (cache[from + to + date] != null) {
            currentExchangeRate = cache[from + to + date];
            return;
        }
        //just incase something bad happens 
        $('#submit').prop('disabled', true); //disable button
        var url = "http://sdw.ecb.europa.eu/curConverter.do?sourceAmount=1.0&sourceCurrency=" + to + "&targetCurrency=" + from + "&inputDate=" + date + "&submitConvert.x=210&submitConvert.y=3";
        
            // assemble the YQL call
        getjson = $.getJSON("https://query.yahooapis.com/v1/public/yql?" +
                    "q=select%20*%20from%20html%20where%20url%3D%22" +
                    encodeURIComponent(url) +
                    "%22&format=xml'&callback=?",

            function (data) { //things in this function only happen after the ajax as be
                if (data.results[0]) {
                    var object = $('<div/>').html(data.results).contents(); //converts string into jquery object containing html tags, etc
                    var div = object.find('div[id="contentlimiter"]');
                    if (from != "EUR" && to != "EUR") {
                        var valFrom = div.find('td:contains(' + from + ')')[2].innerText;
                        valFrom = valFrom.split("=")[1];
                        valFrom = valFrom.split(" ")[1];
                        var resultFrom = parseFloat(valFrom, 10);
                        var valTo = div.find('td:contains(' + to + ')')[2].innerText;
                        valTo = valTo.split("=")[1];
                        valTo = valTo.split(" ")[1];
                        var resultTo = parseFloat(valTo, 10);
                        currentExchangeRate = resultTo / resultFrom;
                    }
                    else {
                        var notEur;
                        if (from == "EUR") {
                            notEur = to;
                        }
                        else {
                            notEur = from;
                        }
                        var val = div.find('td:contains(' + notEur + ')')[2].innerText;
                        val = val.split("=")[1];
                        val = val.split(" ")[1];
                        var result = parseFloat(val, 10);
                        if (from == "EUR") {
                            currentExchangeRate = result;
                        }
                        else {
                            currentExchangeRate = 1 / result;
                        }
                    }
                    cache[from + to + date] = currentExchangeRate;
                }
                $('#submit').prop('disabled', false); //reenable button
            }
        );
    }
    var addZero = function (val) {
        if (val < 10) {
            return "0" + val;
        }
        return val;
    }
    return scrapper;
})();



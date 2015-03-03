/// <reference path="../Scripts/MobileServices.Web-1.2.5.min.js" />
window.CurrencyConvert.database = (function () {


    var database = {};
    // Common initialization function (to be called from each page)
    database.initialize = function () {
        /**
        * database.updateRate
        * returns a rate if cached otherwise returns null and retrieves value
        * and inserts into cache
        *
        * @param {string} from currency code
        * @param {string} to currency code
        * @param {Date} date
        * @return {number || null} number if cached || null if not cached
        *                   
        */
        database.updateRate = function (from, to, date) {
            return updateRate(from, to, date);
        }
       /**
       * database.updateGraph
       * retrieves a list of rates to use for the graph
       *
       * @param {string} from currency code
       * @param {string} to currency code
       * @param {Date} date
       *                   
       */
        database.updateGraph = function (from, to, date) {
            getGraphRates(from, to, date);
        }
        database.checkQueFinished = function () {
            return que === 0;
        }
        database.getQue = function () {
            return que;    
        }
        database.setQue = function (val) {
            que = val;    
        }
    };
    var cache = {};
    var client = new WindowsAzure.MobileServiceClient("https://currencyconvertersuite.azure-mobile.net/", "acxNSVXsPtUkSIdIWzTdePGrigqsRW85");
    var que = 0;
    /**
    * updateRate
    * returns a rate if cached otherwise returns null and retrieves value
    * and inserts into cache
    *
    * @param {string} from currency code
    * @param {string} to currency code
    * @param {Date} date
    * @return {number || null} number if cached || null if not cached
    *                   
    */
    var updateRate = function (from, to, date) {
        if (from == to) {
            return 1;
        }
        var sqlDate = formatDate(date);
        if (cache[from + to + sqlDate] != null) {
            return cache[from + to + sqlDate];
        }
        que += 1;
        $('#submit').prop('disabled', true); //disable button
        switch ("EUR") {
            case from:
                retrieve(to, sqlDate, function (results) {
                    cache[from + to + sqlDate] = results[0].rate;
                    cache[to + from + sqlDate] = 1 / results[0].rate;

                    //app.showNotification("YAH!!", results[0].currency + ": " + results[0].rate + " at " + results[0].time);
                    $('#submit').prop('disabled', false); //enable button
                    if (results[0].time.getDay() === 5) { //cache weekends and fridays
                        var saturday = new Date(results[0].time);
                        var sunday = new Date(results[0].time);
                        saturday.setDate(results[0].time.getDate() + 1);
                        sunday.setDate(results[0].time.getDate() + 2);
                        cache[from + to + formatDate(results[0].time)] = results[0].rate;
                        cache[to + from + formatDate(results[0].time)] = 1 / results[0].rate;
                        cache[from + to + formatDate(saturday)] = results[0].rate;
                        cache[to + from + formatDate(saturday)] = 1 / results[0].rate;
                        cache[from + to + formatDate(sunday)] = results[0].rate;
                        cache[to + from + formatDate(sunday)] = 1 / results[0].rate;
                    }
                    que -= 1;
                });
                break;
            case to:
                retrieve(from, sqlDate, function (results) {
                    cache[to + from + sqlDate] = results[0].rate;
                    cache[from + to + sqlDate] = 1 / results[0].rate;

                    //app.showNotification("YAH!!", results[0].currency + ": " + results[0].rate + " at " + results[0].time);
                    $('#submit').prop('disabled', false); //enable button
                    if (results[0].time.getDay() === 5) {//cache weekends and fridays
                        var saturday = new Date(results[0].time);
                        var sunday = new Date(results[0].time);
                        saturday.setDate(results[0].time.getDate() + 1);
                        sunday.setDate(results[0].time.getDate() + 2);
                        cache[from + to + formatDate(results[0].time)] = 1 / results[0].rate;
                        cache[to + from + formatDate(results[0].time)] = results[0].rate;
                        cache[from + to + formatDate(saturday)] = 1 / results[0].rate;
                        cache[to + from + formatDate(saturday)] = results[0].rate;
                        cache[from + to + formatDate(sunday)] = 1 / results[0].rate;
                        cache[to + from + formatDate(sunday)] = results[0].rate;
                    }
                    que -= 1;
                });
                break;
            default:
                retrieve(from, sqlDate, function (fromResults) {
                    retrieve(to, date, function (toResults) {
                        cache[from + to + sqlDate] = toResults[0].rate / fromResults[0].rate;
                        cache[to + from + sqlDate] = fromResults[0].rate / toResults[0].rate;
                        //app.showNotification("YAH!!", from + " to " + to + "is " + (toResults[0].rate / fromResults[0].rate));
                        $('#submit').prop('disabled', false); //enable button
                        if (toResults[0].time.getDay() === 5) {//cache weekends and fridays
                            var saturday = new Date(toResults[0].time);
                            var sunday = new Date(toResults[0].time);
                            saturday.setDate(toResults[0].time.getDate() + 1);
                            sunday.setDate(toResults[0].time.getDate() + 2);
                            cache[from + to + formatDate(toResults[0].time)] = toResults[0].rate / fromResults[0].rate;
                            cache[to + from + formatDate(fromResults[0].time)] = fromResults[0].rate / toResults[0].rate;
                            cache[from + to + formatDate(saturday)] = toResults[0].rate / fromResults[0].rate;
                            cache[to + from + formatDate(saturday)] = fromResults[0].rate / toResults[0].rate;
                            cache[from + to + formatDate(sunday)] = toResults[0].rate / fromResults[0].rate;
                            cache[to + from + formatDate(sunday)] = fromResults[0].rate / toResults[0].rate;
                        }
                        que -= 1;
                    });
                });
                break;
        }
        return null;
    };
    /**
    * retrieve
    * returns a rate if cached otherwise returns null and retrieves value
    * and inserts into cache
    *
    * @param {string} currency code to look for
    * @param {Date} date
    * @param {function} a callback function used after a rate is found                  
    */
    var retrieve = function (cur, dateSQL, callback) {
        var rates = client.getTable('exchangeRates');
        rates.where(function (cur, date) {
            return this.currency == cur && this.time == date;
        }, cur, dateSQL).read().done(function (results) {
            //no currency rate found on given date
            if (results.length == 0) {
                rates.where(function (cur, date) {
                    return this.currency == cur && this.time < date;
                }, cur, dateSQL).orderByDescending("time").read().done(function (results) {
                    //couldn't find currency data before given date
                    if (results.length == 0) {
                        //check after given date
                        rates.where(function (cur, date) {
                            return this.currency == cur && this.time > date;
                        }, cur, dateSQL).orderBy("time").read().done(function (results) {
                            if (results.length == 0) {
                                //couldn't currency in database
                            }
                            else {
                                //results[0].date is the closest date above result  
                                callback(results);
                            }
                        }, function (err) {
                            app.showNotification("Error: " + err);
                        });
                    }
                    else {
                        //results[0].date is the closest date before given date
                        callback(results);
                    }
                }, function (err) {
                    app.showNotification("Error: " + err);
                });
            }
            else {
                //results[0].date is the given date
                callback(results);
            }
        }, function (err) {
            app.showNotification("Error: " + err);
        });       
    }
    /**
    * formatDate
    * formats string in the correct format
    *
    * @param {Date} date
    * @return {string} 
    */
    var formatDate = function (date) {
        //2015-02-20T00:00:00+00:00
        return date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + 'T00:00:00+00:00';
    }
    /**
    * getGraphRates
    * Interacts with the graph to update it with the currently select values
    * currencies
    * @param {string} for currency code to look for
    * @param {string} to currency code to look for
    * @param {Date} date
    */
    var getGraphRates = function (from, to, date) {
        var range = 14;
        var sqlDate = formatDate(date);
        var isTo = 0;
        var cur = to;
        switch ("EUR") {
            case to:
                isTo = 1;
                cur = from;
            case from:
                retrieve(cur, sqlDate, function (resultsDate) {
                    var upperLimit = dateDiffInDays(new Date(), resultsDate[0].time);
                    if (upperLimit > range/2) {
                        upperLimit = range/2;
                    }
                    var low = new Date();
                    var upper = new Date();
                    low.setDate(date.getDate() - (range - upperLimit));
                    upper.setDate(date.getDate() + upperLimit);
                    retrieveRange(formatDate(low), formatDate(upper), cur, function (results) {
                        var graphData = [];
                        for (var i = 0; i < results.length; i++) {
                            if (isTo == 1) {
                                results[i].rate = 1/results[i].rate;
                            }
                            graphData.push([results[i].time, results[i].rate]);
                            if (results[i].time.getDay() === 5) {
                                var saturday = new Date(results[i].time);
                                var sunday = new Date(results[i].time);
                                saturday.setDate(results[i].time.getDate() + 1);
                                sunday.setDate(results[i].time.getDate() + 2);
                                if (saturday <= new Date()) {
                                    graphData.push([saturday, results[i].rate]);
                                    if (sunday <= new Date()) {
                                        graphData.push([sunday, results[i].rate]);
                                    }
                                }
                            }
                        }
                        graph.update(graphData);
                    });
                    
                });
                break;
            default:
                retrieve(from, sqlDate, function (resultsDate) {
                    var upperLimit = dateDiffInDays(new Date(), resultsDate[0].time);
                    if (upperLimit > range/2) {
                        upperLimit = range/2;
                    }
                    var low = new Date();
                    var upper = new Date();
                    low.setDate(date.getDate() - (range - upperLimit));
                    upper.setDate(date.getDate() + upperLimit);
                    retrieveRange(formatDate(low), formatDate(upper), from, function (fromResults) {
                        retrieveRange(formatDate(low), formatDate(upper), to, function (toResults) {
                            var length = 0;
                            if (fromResults.length < toResults.length) {
                                length = fromResults.length;
                            }
                            else {
                                length = toResults.length;
                            }
                            var graphData = [];
                            for (var i = 0; i < length; i++) {//I'm kind of lying here and asssuming they found the same dates, otherwise it gets very complicated
                                graphData.push([fromResults[i].time, toResults[i].rate / fromResults[i].rate]);
                                if (fromResults[i].time.getDay() == 5) {
                                    var saturday = new Date(fromResults[i].time);
                                    var sunday = new Date(fromResults[i].time);
                                    saturday.setDate(fromResults[i].time.getDate() + 1);
                                    sunday.setDate(fromResults[i].time.getDate() + 2);
                                    if (saturday <= new Date()) {
                                        graphData.push([saturday, toResults[i].rate / fromResults[i].rate]);
                                        if (sunday <= new Date()) {
                                            graphData.push([sunday, toResults[i].rate / fromResults[i].rate]);
                                        }
                                    }
                                }
                            }
                            graph.update(graphData);
                        });
                    });
                });
                break;
        }
    };

    /**
    * retrieveRange
    * Retieve a range of values from the database
    * based upon date
    * @param {string} the lowest date 
    * @param {string} the highest date
    * @param {string} the currency to look for 
    * @param {function} function to go to after query is finished
    */
    var retrieveRange = function (low, high, cur, callback) {
        var rates = client.getTable('exchangeRates');
        rates.where(function (cur, low, high) {
            return this.currency == cur && this.time >= low && this.time <= high;
        }, cur, low, high).orderBy("time").read().done(function (results) {
            //no currency rate found on given date range
            if (results.length == 0) {
                //something went wrong
            }
            else {
                //results[0].date is the given date
                callback(results);
            }
        }, function (err) {
            app.showNotification("Error: " + err);
        });
    }
    //TODO
   
    
    //handle daylight saving
    /**
    * dateDiffInDays
    * Retieve a range of values from the database
    * based upon date
    * @param {date} the higher date 
    * @param {date} the lower date
    * @return {number} number of dates inbetween the two params
    */
    var dateDiffInDays = function (a, b) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
   
    return {
        initialize: initialize
    };
})();
var database = (function () {


    var database = {};
    // Common initialization function (to be called from each page)
    database.initialize = function () {
        database.updateRate = function (from, to, date) {
            updateRate(from, to, date);
        }
        database.updateGraph = function (from, to, date) {
            getGraphRates(from, to, date);
        }
    };
    var cache = {};
    var getjson = null;
    var client = new WindowsAzure.MobileServiceClient("https://currencyconvertersuite.azure-mobile.net/", "acxNSVXsPtUkSIdIWzTdePGrigqsRW85");
    var updateRate = function (from, to, date) {
        if (getjson != null) {
            getjson.abort(); //incase the user changes currency before the current request is complete
        }
        currentExchangeRate = 1;
        if (from == to) {
            return;
        }
        var sqlDate = formatDate(date);
        if (cache[from + to + sqlDate] != null) {
            currentExchangeRate = cache[from + to + sqlDate];
            return;
        }
        switch ("EUR") {
            case from:
                retrieve(to, sqlDate, function (results) {
                    cache[from + to + sqlDate] = results[0].rate;
                    app.showNotification("YAH!!", results[0].currency + ": " + results[0].rate + " at " + results[0].time);
                    $('#submit').prop('disabled', false); //enable button
                });
                break;
            case to:
                retrieve(from, sqlDate, function (results) {
                    cache[from + to + sqlDate] = 1 / results[0].rate;
                    app.showNotification("YAH!!", results[0].currency + ": " + results[0].rate + " at " + results[0].time);
                    $('#submit').prop('disabled', false); //enable button
                });
                break;
            default:
                retrieve(from, sqlDate, function (fromResults) {
                    retrieve(to, date, function (toResults) {
                        cache[from, to, sqlDate] = toResults[0].rate / fromResults[0].rate;
                        app.showNotification("YAH!!", from + " to " + to + "is " + (toResults[0].rate / fromResults[0].rate));
                        $('#submit').prop('disabled', false); //enable button
                    });
                });
                break;
        }
                
    };   
    var retrieve = function (cur, dateSQL, callback) {
        var rates = client.getTable('exchangeRates');
        $('#submit').prop('disabled', true); //disable button
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

    var formatDate = function (date) {
        //2015-02-20T00:00:00+00:00
        return date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + 'T00:00:00+00:00';
    }

    var getGraphRates = function (from, to, date) {
        var sqlDate = formatDate(date);
        var isTo = 0;
        var cur = to;
        switch ("EUR") {
            case to:
                isTo = 1;
                cur = from;
            case from:
                retrieve(cur, sqlDate, function (results) {
                    var resultsDate = sqlToJsDate(results[0].date);
                    var upperLimit = new Date() - resultsDate;
                    if (upperLimit > 9) {
                        upperLimit = 9;
                    }
                    retrieveRange(formatDate(resultsDate - (18 - upperLimit)), formatDate(resultsDate + upperLimit), cur, function (results) {
                        var graphData = [];
                        for (var i = 0; i < results.length; i++) {
                            if (isTo == 0) {
                                graphData[i] = [sqlToJsDate(results[i].date), results[i].rate];
                            }
                            else if (isTo == 1) {
                                graphData[i] = [sqlToJsDate(results[i].date), 1 / results[i].rate];
                            }
                        }
                        app.showNotification(graphData);
                        //update graph
                    });
                    
                });
                break;
            default:
                var fromData = [];
                retrieve(from, sqlDate, function (results) {
                    var resultsDate = sqlToJsDate(results[0].time);
                    var upperLimit = new Date() - resultsDate;
                    if (upperLimit > 9) {
                        upperLimit = 9;
                    }
                    retrieveRange(formatDate(resultsDate - (18 - upperLimit)), formatDate(resultsDate + upperLimit), from, function (fromResults) {
                        retrieveRange(formatDate(resultsDate - (18 - upperLimit)), formatDate(resultsDate + upperLimit), to, function (fromResults) {
                            for (var i = 0; i < results.length; i++) {//I'm kind of lying here and asssuming they found the same dates, otherwise it gets very complicated
                                graphData[i] = [sqlToJsDate(fromResults[i].date), toResults[i].rate / fromResults[i].rate];
                            }
                            app.showNotification(graphData);
                            //update the graph here
                        });
                    });
                });
                break;
        }
    };


    var retrieveRange = function (low, high, cur, callback) {
        var rates = client.getTable('exchangeRates');
        $('#submit').prop('disabled', true); //disable button
        rates.where(function (cur, date) {
            return this.currency == cur && this.time >= low && this.time <= high;
        }, cur, dateSQL).read().done(function (results) {
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
    var sqlToJsDate = function (sqlDate) {
        //Wed Feb 25 2015 00:00:00 GMT+0000 (GMT Standard Time)
        
    }
    return database;
})();
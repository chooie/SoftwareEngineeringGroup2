/// <reference path="../Scripts/MobileServices.Web-1.2.5.min.js" />
window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.database = (function() {

  var cache = {},
    client = new WindowsAzure.MobileServiceClient(
      // WARNING: Careful putting this under version control
      "https://currencyconvertersuite.azure-mobile.net/",
      "acxNSVXsPtUkSIdIWzTdePGrigqsRW85"),
    queue = 0,
  // Private Methods
    helpers,
    retrieve,
    formatDate,
    updateRate,
    dateDiffInDays,
    retrieveRange,
    getGraphRates;

  /**
   * retrieve
   * Returns a rate if cached otherwise returns null and retrieves value
   * and inserts into cache
   *
   * @param {string} currency code to look for
   * @param {Date} date
   * @param {function} a callback function used after a rate is found
   */
  retrieve = function (cur, dateSQL, callback) {
    var rates = client.getTable('exchangeRates');

    /* retrieve method helpers */
    helpers = {
      getMatchingCurrencyAtDate: function (cur, date) {
        return this.currency === cur && this.time === date;
      },

      getMatchingCurrencyLessThanDate: function (cur, date) {
        return this.currency === cur && this.time < date;
      },

      getMatchingCurrencyGreaterThanDate: function (cur, date) {
        return this.currency === cur && this.time > date;
      },

      handleGreaterThan: function (results) {
        if (results.length === 0) {
          // Couldn't find currency in database
          throw new Error("retrieve(): Could not find a matching currency in " +
            "the database");
        }
        // results[0].date is the closest date above
        // result
        callback(results);
      },

      handleLessThan: function (results) {
        // Couldn't find currency data before given date
        if (results.length === 0) {
          // Check after given date
          rates.where(this.getMatchingCurrencyGreaterThanDate,
            cur,
            dateSQL)
            .orderBy("time").read()
            .done(this.handleGreaterThan, this.displayError);
        }
        else {
          // results[0].date is the closest date before given date
          callback(results);
        }
      },

      handleCurrencyAtDate: function (results) {
        // No currency rate found on given date
        if (results.length === 0) {
          rates.where(this.getMatchingCurrencyLessThanDate, cur, dateSQL)
            .orderByDescending("time").read()
              .done(this.handelLessThan, this.displayError);
        }
        else {
          console.log(callback);
          // results[0].date is the given date
          callback(results);
        }
      },

      displayError: function (err) {
        app.showNotification("Error: " + err);
      }
    };

    // Where the magic happens
    rates.where(helpers.getMatchingCurrencyAtDate, cur, dateSQL).read()
      .done(helpers.handleCurrencyAtDate, helpers.displayError);
  };

  /**
   * formatDate
   * Formats string in the correct format
   *
   * @param {Date} date
   * @return {string}
   */
  formatDate = function (date) {
    try {
      if (typeof date !== "object" || !date) {
        throw new TypeError("formatDate(): Passed parameter was not of  " +
          "String type.");
      }
    } catch (e) {
      console.log("Invalid date object given. Assuming date today.");
      //date = new Date();
    }
    //2015-02-20T00:00:00+00:00
    return date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2) + 'T00:00:00+00:00';
  };

  /**
   * updateRate
   * Returns a rate if cached otherwise returns null and retrieves value
   * and inserts into cache
   *
   * @param {string} from currency code
   * @param {string} to currency code
   * @param {Date} date
   * @return {number || null} number if cached || null if not cached
   *
   */
  updateRate = function(from, to, date) {
    var sqlDate,
      handleRetrieve;

    if (from === to) {
      return 1;
    }

    sqlDate = formatDate(date);
    if (typeof cache[from + to + sqlDate] === "number") {
      return cache[from + to + sqlDate];
    }
    // Add job to the queue
    queue += 1;

    // Disable button
    $('#submit').prop('disabled', true);

    // TODO - Can we have a session where we go through this?
    
    // Handler for retrieve
    handleRetrieve = function(results) {
      var firstBranch = false,
        rate = results[0].rate,
        time = results[0].time,
        saturday,
        sunday;
  
      if (from === "EUR") {
        cache[from + to + sqlDate] = rate;
        cache[to + from + sqlDate] = 1 / rate;
        firstBranch = true;
      } else if (to === "EUR") {
        cache[to + from + sqlDate] = rate;
        cache[from + to + sqlDate] = 1 / rate;
      }
  
      $('#submit').prop('disabled', false); //enable button
      // Cache weekends and fridays
      if (time.getDay() === 5) {
        saturday = new Date(time);
        sunday = new Date(time);
        saturday.setDate(time.getDate() + 1);
        sunday.setDate(time.getDate() + 2);
    
        // Cache both currency rates at some time
        cache[from + to + formatDate(time)] =
          firstBranch ? rate : 1 / rate;
      
        cache[to + from + formatDate(time)] =
          firstBranch ? 1 / rate : rate ;
    
        // Cache both currency rates on the Saturday after that time  
        cache[from + to + formatDate(saturday)] =
          firstBranch ? rate : 1 / rate;
      
        cache[to + from + formatDate(saturday)] =
          firstBranch ? 1 / rate : rate ;
    
        // Cache both currency rates on the Sunday after that time  
        cache[from + to + formatDate(sunday)] =
          firstBranch ? rate : 1 / rate;
      
        cache[to + from + formatDate(sunday)] =
          firstBranch ? 1 / rate : rate ;
      }
      queue -= 1;
    };

    if (from === "EUR") {
      retrieve(to, sqlDate, handleRetrieve);

    } else if (to === "EUR") {
      retrieve(from, sqlDate, handleRetrieve);

    } else {
      // Neither currency is EUR
      retrieve(from, sqlDate, function(fromResults) {
        retrieve(to, date, function (toResults) {
          var toRate = toResults[0].rate,
            fromRate = fromResults[0].rate;
          cache[from + to + sqlDate] =
            toRate / fromRate;
          cache[to + from + sqlDate] =
            fromRate / toRate;
          // app.showNotification("YAH!!", from + " to " + to +
          // "is " + (toRate / fromRate));
          $('#submit').prop('disabled', false); //enable button
          // Cache weekends and fridays
          if (toResults[0].time.getDay() === 5) {
            var saturday = new Date(toResults[0].time),
              sunday = new Date(toResults[0].time);

            saturday.setDate(toResults[0].time.getDate() + 1);
            sunday.setDate(toResults[0].time.getDate() + 2);
            cache[from + to + formatDate(toResults[0].time)] =
              toRate / fromRate;
            cache[to + from + formatDate(fromResults[0].time)] =
              fromRate / toRate;
            cache[from + to + formatDate(saturday)] = toRate / fromRate;
            cache[to + from + formatDate(saturday)] = fromRate / toRate;
            cache[from + to + formatDate(sunday)] = toRate / fromRate;
            cache[to + from + formatDate(sunday)] = fromRate / toRate;
          }
          queue -= 1;
        });
      });
    }
  };

  // Handle daylight saving
  /**
   * dateDiffInDays
   * Retieve a range of values from the database
   * based upon date
   * @param {date} the higher date
   * @param {date} the lower date
   * @return {number} number of dates inbetween the two params
   */
  dateDiffInDays = function(a, b) {
    var MS_PER_DAY = 1000 * 60 * 60 * 24,
      utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
      utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
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
  retrieveRange = function(low, high, cur, callback) {
    var rates = client.getTable('exchangeRates');
    rates.where(function(cur, low, high) {
      return this.currency === cur &&
        this.time >= low &&
        this.time <= high;
    }, cur, low, high).orderBy("time").read().done(function(results) {
      //no currency rate found on given date range
      if (results.length === 0) {
        // Something went wrong
        console.log("Something went wrong.");
      }
      else {
        //results[0].date is the given date
        callback(results);
      }
    }, function(err) {
      app.showNotification("Error: " + err);
    });
  };

  /**
   * getGraphRates
   * Interacts with the graph to update it with the currently select values
   * currencies
   * @param {string} for currency code to look for
   * @param {string} to currency code to look for
   * @param {Date} date
   */
  getGraphRates = function(from, to, date) {
    var range = 14,
      sqlDate = formatDate(date),
      isTo = 0,
      cur = to,
      graph = window.CurrencyConverter.graph;

    switch("EUR") {
      case to:
        isTo = 1;
        cur = from;
      // TODO: Deliberate fall through?
      case from:
        retrieve(cur, sqlDate, function(resultsDate) {
          var upperLimit = dateDiffInDays(
              new Date(),
              resultsDate[0].time),
            low,
            upper,
            saturday,
            sunday;

          if (upperLimit > range / 2) {
            upperLimit = range / 2;
          }
          low = new Date();
          upper = new Date();
          low.setDate(date.getDate() - (range - upperLimit));
          upper.setDate(date.getDate() + upperLimit);
          retrieveRange(formatDate(low),
            formatDate(upper),
            cur,
            function(results) {
              var graphData = [],
                i;
              for (i = 0; i < results.length; i++) {
                if (isTo === 1) {
                  results[i].rate = 1 / results[i].rate;
                }
                graphData.push([results[i].time, results[i].rate]);
                if (results[i].time.getDay() === 5) {
                  saturday = new Date(results[i].time);
                  sunday = new Date(results[i].time);
                  saturday.setDate(results[i].time.getDate() + 1);
                  sunday.setDate(results[i].time.getDate() + 2);
                  if (saturday <= new Date()) {
                    graphData.push([saturday, results[i].rate]);
                    if (sunday <= new Date()) {
                      graphData.push(
                        [sunday, results[i].rate]
                      );
                    }
                  }
                }
              }
              graph.update(graphData);
            });
        });
        break;
      default:
        retrieve(from, sqlDate, function(resultsDate) {
          var upperLimit = dateDiffInDays(
              new Date(),
              resultsDate[0].time
            ),
            low = new Date(),
            upper = new Date();

          if (upperLimit > range / 2) {
            upperLimit = range / 2;
          }

          low.setDate(date.getDate() - (range - upperLimit));
          upper.setDate(date.getDate() + upperLimit);
          retrieveRange(formatDate(low), formatDate(upper),
            from, function(fromResults) {
              retrieveRange(formatDate(low), formatDate(upper),
                to, function(toResults) {
                  var length = 0,
                    graphData = [],
                    i,
                    saturday,
                    sunday;

                  if (fromResults.length < toResults.length) {
                    length = fromResults.length;
                  }
                  else {
                    length = toResults.length;
                  }
                  // I'm kind of lying here and asssuming they found
                  // the same dates, otherwise it gets very complicated
                  for (i = 0; i < length; i++) {
                    graphData.push([fromResults[i].time,
                      toResults[i].rate / fromResults[i].rate]);
                    if (fromResults[i].time.getDay() === 5) {
                      saturday = new Date(fromResults[i].time);
                      sunday = new Date(fromResults[i].time);
                      saturday.setDate(
                        fromResults[i].time.getDate() + 1);
                      sunday.setDate(
                        fromResults[i].time.getDate() + 2);
                      if (saturday <= new Date()) {
                        graphData.push([
                          saturday,
                          toResults[i].rate /
                          fromResults[i].rate
                        ]);
                        if (sunday <= new Date()) {
                          graphData.push([
                            sunday,
                            toResults[i].rate /
                            fromResults[i].rate
                          ]);
                        }
                      }
                    }
                  }
                  graph.update(graphData);
                });
            });
        });
        break;
      // default
    }
  };

  //TODO

  return {

    updateRate: updateRate,

    /**
     * database.updateGraph
     * retrieves a list of rates to use for the graph
     *
     * @param {string} from currency code
     * @param {string} to currency code
     * @param {Date} date
     *
     */
    updateGraph: getGraphRates,

    checkQueueFinished: function() {
      return queue === 0;
    },

    getQueue: function() {
      return queue;
    },

    setQueue: function(val) {
      queue = val;
    }
  };
}());

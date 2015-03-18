(function () {
  window.CurrencyConverter = window.CurrencyConverter || {};

  window.CurrencyConverter.conversionDisplay = {};

  var conversionDisplay = window.CurrencyConverter.conversionDisplay;

  conversionDisplay.model = {
    getRate: function() {
      var currencySymbols = conversionDisplay.controller.getCurrencySymbols();
      if (typeof this.home === 'object' && this.home) {
        console.log(this.home.getExchangeRate(currencySymbols[0], currencySymbols[1],
          this.getSelectedDate()));
        return this.home.getExchangeRate(currencySymbols[0], currencySymbols[1],
          this.getSelectedDate());
      }
    },

    getSelectedDate: function() {
      var datePicker = $('#datepicker'),
        db = window.CurrencyConverter.database;
      console.log(datePicker.val());
      return new Date(datePicker.val());
    },

    update: function () {
      this.home = window.CurrencyConverter.home;
    }
  };

  conversionDisplay.controller = {
    init: function () {
      conversionDisplay.view.init();
      conversionDisplay.view.poll();
    },

    getCurrencySymbols: function() {
      return conversionDisplay.view.getCurrencySymbols();
    },

    getRate: function() {
      return conversionDisplay.model.getRate();
    },

    update: function () {
      conversionDisplay.model.update();
    }
  };

  conversionDisplay.view = {
    getCurrencySymbols: function () {
      var fromCurrency = $('#from-currency'),
        toCurrency = $('#to-currency');
      return [fromCurrency.val(), toCurrency.val()];
    },

    update: function () {
      var currencySymbols = this.getCurrencySymbols(),
        rate = conversionDisplay.controller.getRate();

      if (typeof rate !== 'number') {
        this.conversionDisplay.text('Loading Conversion Text...');
      } else {
        this.conversionDisplay.text('1 ' + currencySymbols[0] + ' = ' +
          rate.toFixed(4) + ' ' + currencySymbols[1]);
      }
    },

    /**
     * Will continuosly attempt to update the displayed ratio.
     */
    poll: function () {
      var self = this;
      setTimeout(function () {
        self.update();
        self.poll();
      }, 1000);
    },

    init: function () {
      this.conversionDisplay = $('#conversion-display');
    }
  };

  conversionDisplay.controller.init();
}());
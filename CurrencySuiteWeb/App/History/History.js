window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.history = (function () {
  var allHistory = {},
    initialize,
    updateInput,
    updateOutput,
    fillHistory,
    toggle,
    save,
    formatDate;

  toggle = function () {
    var history = $('#history-wrapper');
    if (history.is(":visible")) {
      fillHistory();
      history.slideUp(1000);
    }
    else {
      history.slideDown(1000);
    }
  };

  fillHistory = function () {
    var middle = '',
      i;
    for (i = 0; i < allHistory.length; i++) {
      middle += '<li class="history-item">' +
                  formatDate(allHistory[i][3]) +
                '</li>';
    }
    $('#history-contents').html(middle);
  };

  updateInput = function (input, currencyDetails, date) {
    if (allHistory.length >= 10) {
      allHistory.shift();
    }
    allHistory.push([input, [], currencyDetails, date]);
  };

  updateOutput = function (output) {
    allHistory[allHistory.length - 1][1] = output;
    save();
  };

  save = function () {
    Office.context.document.settings.set('history', JSON.stringify(allHistory));
    Office.context.document.settings.saveAsync();
  };

  formatDate = function (date) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];
    date = new Date();
    return date.getDate() + "-" + monthNames[date.getMonth()] + "-" +
      date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  };

  initialize = function () {
    allHistory = Office.context.document.settings.get('history');
    if (allHistory === null || allHistory === '') {
      allHistory = [];
    }
    else {
      allHistory = JSON.parse(allHistory);
    }
    $(document).mouseup(function (e) {
      var container = $("#history-wrapper");
      // if the target of the click isn't the container...
      if (!container.is(e.target)
        // ... nor a descendant of the container
          && container.has(e.target).length === 0
        // make sure its not the scroll bar
          && (e.target !== $('html').get(0)))
      {
        container.slideUp(1000);
      }
    });
  };

  return {
    initialize: initialize,
    toggle: toggle,
    updateInput: updateInput,
    updateOutput: updateOutput
  };
}());

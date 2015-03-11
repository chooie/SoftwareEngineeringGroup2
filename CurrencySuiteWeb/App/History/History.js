window.CurrencyConverter.graph = (function () {
  var allHistory = {},
    initialize,
    updateInput,
    updateOutput,
    showHistory,
    hideHistory,
    save,
    formatDate;

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

  showHistory = function () {
    var middle = '',
      i;
    for (i = 0; i < allHistory.length; i++) {
      middle += '<li class="history-item">' +
                  formatDate(allHistory[i][3]) +
                '</li>';
    }
    $('#history-contents').html(middle);
    $('#history-wrapper').slideToggle("slow");
  };

  formatDate = function (date) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];
    date = new Date();
    return date.getDate() + "-" + monthNames[date.getMonth()] + "-" +
      date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  };

  hideHistory = function () {
    $('#history-wrapper').hide();
  };

  initialize = function () {
    allHistory = Office.context.document.settings.get('history');
    if (allHistory === null || allHistory === '') {
      allHistory = [];
    }
    else {
      allHistory = JSON.parse(allHistory);
    }
    var top = '<div id="history-wrapper">' +
        '<div class="padding">' +
        '<div id="history-close"></div>' +
            '<h1 id="history-title"> History </h1>' +
                '<ul id="history-contents">',
      bottom = '</ul>' +
                    '</div>' +
                '</div>';
    $('body').append(top + bottom);
    $('#history-close').click(function () {
      $('#history-wrapper').slideToggle("slow");
    });
  };
}());

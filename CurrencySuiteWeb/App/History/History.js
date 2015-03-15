window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.history = (function () {
  var allHistory = {},
    initialize,
    updateInput,
    updateOutput,
    fillHistory,
    toggle,
    save,
    formatDate,
    ordinal_suffix_of,
    formatData,
    isAllHistoryUptoDate = false,
      radioButtonClickBinding;

  toggle = function () {
    var history = $('#history-wrapper');
    if (history.is(":visible")) {
      history.slideUp(1000);
    }
    else {
      if (!isAllHistoryUptoDate) {
        fillHistory();
        isAllHistoryUptoDate = true;
      }
      history.slideDown(1000);
    }
  };
  formatDate = function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'];

    return ordinal_suffix_of(date.getDate()) + " " +
      monthNames[date.getMonth()] + " " +
      date.getFullYear();
  };
  formatTime = function (date) {
    return date.getHours() + ":" + date.getMinutes() +
      ":" + date.getSeconds();
  }
  ordinal_suffix_of = function (i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };
  fillHistory = function () {
    var middle = '',
      i;
    middle += '<div class="header-row row">' +
                '<span class="cell primary-history">Time</span>' +
                '<span class="cell">From</span>' +
                '<span class="cell">To</span>' +
                '<span class="cell">Date</span>' +
                '<span class="cell">Input</span>' +
                '<span class="cell">Output</span>' +
              '</div>'
    for (i = 0; i < allHistory.length; i++) {
      middle += '<div class="row">' +
        '<input class="radio-input" type="radio" name="expand">' +
        '<span class="cell primary-history" data-label="Time">' +
        formatDate(allHistory[i][0]) + " " + formatTime(allHistory[i][0]) 
        + '</span>' +  '<span class="cell" data-label="From">' + 
        allHistory[i][1][0] + '</span>' +
        '<span class="cell" data-label="To">' + allHistory[i][1][1]
        + '</span>' +
        '<span class="cell" data-label="Date">' +
        formatDate(allHistory[i][1][2]) + '</span>' +
        '<span class="cell" data-label="Input">' + formatData(allHistory[i][2])
        + '</span>' +
        '<span class="cell" data-label="Output">' + formatData(allHistory[i][3])
        + '</span>' +
        '</div>';
    }
    $('#history-table').html(middle);
    if (!radioButtonClickBinding) {
      radioButtonClickBinding = $(".radio-input").click(function () {
        if ($(this).attr('checked')) {
          $(this).attr('checked', false);
        }
        else {
          $(this).attr('checked', true);
        }
      });
    }
  };
  //time, [from, to, dateSelected], input, output
  updateInput = function (currencyDetails, input) {
    isAllHistoryUptoDate = false;
    if (allHistory.length >= 30) {
      allHistory.shift();
    }
    allHistory.push([new Date(), currencyDetails, input, []]);
    
  };

  updateOutput = function (output) {
    isAllHistoryUptoDate = false;
    allHistory[allHistory.length - 1][3] = output;
    save();
  };

  save = function () {
    var string = JSON.stringify(allHistory);
    Office.context.document.settings.set('history', string);
    Office.context.document.settings.saveAsync();
  };
  formatData = function (data) {
    var i,
      j,
      output = '';
    if (data instanceof Array) {
      output += '<table>';
      for (i = 0; i < data.length; i++) {
        output += '<tr>';
        for (j = 0; j < data[i].length; j++) {
          output += '<td>' + data[i][j] + '</td>';
        }
        output += '</tr>';
      }
      output += '</table>';
    }
    else {
      output = data;
    }
    return output;
  };


  initialize = function () {
    allHistory = Office.context.document.settings.get('history');
    if (allHistory && allHistory.length) {
      allHistory = JSON.parse(allHistory);
      for (var i = 0; i < allHistory.length; i++) {
        allHistory[i][0] = new Date(allHistory[i][0]);
        allHistory[i][1][2] = new Date(allHistory[i][1][2]);
      }
    }
    else {
      allHistory = [];
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

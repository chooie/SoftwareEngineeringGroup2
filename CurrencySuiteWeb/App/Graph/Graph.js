window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.graph = (function () {
  // Private
  var updateGraph,
  // Public
    initialize;

  updateGraph = function(values) {
    //if (graphItem != null) {
    //graphItem.setData(values);
    //return;
    //}
    var fromCur = $('#selectedFromCur').val(),
      toCur = $('#selectedToCur').val(),
      graphData;

    $('#graph-label').text(fromCur + " to " + toCur);
    // Graph Data ##############################################
    graphData = [{
      // [Date, Value] 2010/08/17
      data: values,
      color: '#71c73e'
    }];
    // Lines Graph #############################################
    $.plot($('#graph-lines'), graphData, {
      series: {
        points: {
          show: true,
          radius: 5
        },
        lines: {
          show: true
        },
        shadowSize: 0
      },
      grid: {
        color: '#646464',
        borderColor: 'transparent',
        borderWidth: 20,
        hoverable: true
      },
      xaxis: {
        tickColor: 'transparent',
        mode: "time",
        timeformat: "%d/%m"
      },
      yaxis: {}
    });
  };

  // Common initialization function (to be called from each page)
  initialize = function() {
    // add graph to home
    updateGraph();
    // Tooltip #################################################
    function showTooltip(x, y, contents) {
      var width = $('#graph-container').width();
      if (width * 0.65 < x) {
        $('<div id="tooltip">' + contents + '</div>').css({
          top: y - 16,
          left: x - (contents.length * 7) - 20
        }).appendTo('body').fadeIn();
      }
      else {
        $('<div id="tooltip">' + contents + '</div>').css({
          top: y - 16,
          left: x + 20
        }).appendTo('body').fadeIn();
      }
    }

    var previousPoint = null;

    $('#graph-lines, #graph-bars').bind('plothover',
      function(event, pos, item) {
        if (item) {
          if (previousPoint !== item.dataIndex) {
            previousPoint = item.dataIndex;
            $('#tooltip').remove();
            var x = item.datapoint[0],
              y = item.datapoint[1],
              date = new Date(x),
              dateString = date.getDate() + "/" +
                (date.getMonth() + 1) + "/" +
                date.getFullYear();
            showTooltip(item.pageX, item.pageY, y.toFixed(3) +
            ' at ' + dateString);
          }
        } else {
          $('#tooltip').remove();
          previousPoint = null;
        }
      }
    );
  };

  return {
    initialize: initialize,
    update: updateGraph
  };
}());

window.CurrencyConverter = window.CurrencyConverter || {};
window.CurrencyConverter.graph = (function () {
  var updateGraph,
    initialize,
    highlightDataPoint,
    graph,
    numberOfTries = 10;

  updateGraph = function(values) {
    //if (graphItem != null) {
    //graphItem.setData(values);
    //return;
    //}
    if (values == null) {
      return;
    }
    var date = window.CurrencyConverter.datepicker.getSelectedDate();
    var day = [];
    for (var i = 0; i < values.length; i++) {
      if (date.valueOf() === values[i][0].valueOf()) {
        day.push(values[i]);
      }

    }
    var fromCur = $('#from-currency').val(),
      toCur = $('#to-currency').val(),
      graphData;

    $('#graph-label').text(fromCur + " to " + toCur);
    // Graph Data ##############################################
    graphData = [{
      // [Date, Value] 2010/08/17
      data: values,
      color: '#71c73e'
    },
    {
      data: day,
      color: '#2a8dd4'
    }];
    // Lines Graph #############################################
    graph = $.plot($('#graph-lines'), graphData, {
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

    $('#graph-lines').bind('plothover',
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

  highlightDataPoint = function () {
    // TODO
    var selectedDate = "03-03-2015",//$("#datepicker").val(),
      correctFormat = window.CurrencyConverter.datepicker.correctFormat;
    setTimeout(function () {
      try {
        if (!Array.isArray(graph.getData()[0].data[0])) {
          throw new Error("Data didn't load in time");
        }

        graph.getData()[0].data.forEach(function (dataPoint) {
          if (correctFormat(new Date(dataPoint[0])) === selectedDate) {
            // DO SOMETHING TO THE DATA POINT THAT MATCHES THE SELECTED DATE
            // i.e. give it a different colour
            console.log("Found it");
          }
        });
        numberOfTries = 10;
      } catch (e) {
        console.log(e);
        numberOfTries -= 1;
        if (numberOfTries <= 0) {
          throw new Error("Couldn't get graph data after a number of tries.");
        }
        highlightDataPoint();
      }
    }, 5000);

  };

  return {
    initialize: initialize,
    update: updateGraph,
    highlightDataPoint: highlightDataPoint
  };
}());

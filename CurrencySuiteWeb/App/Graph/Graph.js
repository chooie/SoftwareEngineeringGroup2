window.CurrencyConverter.graph = (function () {


    var graph = {},
        graphData;
    // Common initialization function (to be called from each page)
    graph.initialize = function () {
        // add graph to home
        updateGraph();
        // Tooltip #################################################
        function showTooltip(x, y, contents) {
            var width = $('#graph-container').width();
            if (width * 0.65 < x) {
                $('<div id="tooltip">' + contents + '</div>').css({
                    top: y - 16,
                    left: x - (contents.length*7) - 20
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

        $('#graph-lines, #graph-bars').bind('plothover', function (event, pos, item) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $('#tooltip').remove();
                    var x = item.datapoint[0],
                        y = item.datapoint[1];
                    var date = new Date(x);
                    var dateString = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    showTooltip(item.pageX, item.pageY, y.toFixed(3) + ' at ' + dateString);
                }
            } else {
                $('#tooltip').remove();
                previousPoint = null;
            }
        });
        // Create public graph.update
        graph.update = function (values) {
            updateGraph(values);
        }
    };
    var graphItem = null
    updateGraph = function (values) {
        //if (graphItem != null) {
            //graphItem.setData(values);
            //return;
        //}
        var fromCur = $('#selectedFromCur').val();
        var toCur = $('#selectedToCur').val();
        $('#graph-label').text(fromCur +" to " + toCur);
        // Graph Data ##############################################
        var graphData = [{
            // [Date, Value] 2010/08/17
            data: values,
            color: '#71c73e'
        }];
        // Lines Graph #############################################
        graphItem = $.plot($('#graph-lines'), graphData, {
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
            yaxis: {
            }
        });
    }
   
    return graph;
})();
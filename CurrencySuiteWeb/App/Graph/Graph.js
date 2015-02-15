var graph = (function () {


    var graph = {};
    var graphData;
    // Common initialization function (to be called from each page)
    graph.initialize = function () {
        updateGraph();
        // Tooltip #################################################
        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                top: y - 16,
                left: x + 20
            }).appendTo('body').fadeIn();
        }

        var previousPoint = null;

        $('#graph-lines, #graph-bars').bind('plothover', function (event, pos, item) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $('#tooltip').remove();
                    var x = item.datapoint[0],
                        y = item.datapoint[1];
                    showTooltip(item.pageX, item.pageY, y + ' at ' + x);
                }
            } else {
                $('#tooltip').remove();
                previousPoint = null;
            }
        });
        graph.update = function () {
            updateGraph();
        }
    };
    updateGraph = function () {
        var fromCur = $('#selectedFromCur').val();
        var toCur = $('#selectedToCur').val();
        $('#graph-label').text(fromCur +" to " + toCur);
        // Graph Data ##############################################
        var graphData = [{
            // Visits
            data: [[6, 1.23], [7, 1.21], [8, 1.15], [9, 1.17], [10, 1.19], [11, 1.15], [12, 1.27], [13, 1.25], [14, 1.23], [15, 1.20]],
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
                tickColor: 'transparent'
            },
            yaxis: {
                tickSize: 0.05
            }
        });
    }
   
    return graph;
})();
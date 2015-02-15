var graph = (function () {


    var graph = {};
    var graphData;
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
                    showTooltip(item.pageX, item.pageY, y + ' at ' + dateString);
                }
            } else {
                $('#tooltip').remove();
                previousPoint = null;
            }
        });
        // Create public graph.update
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
            // [Date, Value] 2010/08/17
            data: [[new Date("2015/12/1"), 1.23], [new Date("2015/12/2"), 1.21], [new Date("2015/12/3"), 1.15], [new Date("2015/12/4"), 1.17], [new Date("2015/12/5"), 1.19], [new Date("2015/12/6"), 1.15], [new Date("2015/12/7"), 1.27], [new Date("2015/12/8"), 1.25], [new Date("2015/12/9"), 1.23], [new Date("2015/12/10"), 1.20]],
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
            },
            yaxis: {
                tickSize: 0.05 
            }
        });
    }
   
    return graph;
})();
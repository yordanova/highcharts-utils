function onLegendItemClick(e) {
    e.preventDefault();
    var s = this.chart.series;
    var isAllTrue = true;
    var numTrue = 0;
    var seriesTrue;
    for (i = 0; i < s.length; i++) {
        if (!s[i].visible) { // there is one that is false
            isAllTrue = false;
        } else {
            numTrue++;
            seriesTrue = s[i];
        }
    }
    if (isAllTrue) { // all are true
        for (i = 0; i < s.length; i++) {
            if (this != s[i]) { //set everyone else to false
                s[i].setVisible(false);
            }
        }
    } else if (numTrue == 1 && this == seriesTrue) {
        for (i = 0; i < s.length; i++) {
            s[i].setVisible(true);
        }
    } else {
        this.setVisible(!this.visible);
    }

    return false;
}

(function (H) {
    H.wrap(H.Chart.prototype, 'init', function (proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        var chart = this;
        var isClickReversed = !!chart.legend.options.reverseClick;

        if (isClickReversed) {
            if (!chart.options.plotOptions.series) {
                chart.options.plotOptions.series = {};
            }
            if (!chart.options.plotOptions.series.events) {
                chart.options.plotOptions.series.events = {};
            }
            chart.update({
                plotOptions: {
                    series: {
                        events: {
                            legendItemClick: onLegendItemClick
                        }
                    }
                }
            })
        }
    });
}(Highcharts));
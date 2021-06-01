(function (H) {
  H.wrap(H.Chart.prototype, 'init', function (proceed) {
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    var chart = this;
    var isLegendClickReversed = !!chart.legend.options.reverseLegendClickAction;
    chart.update({
      chart: {
        __visibleSeries: []
      }
    });
    if(isLegendClickReversed){
      if(!chart.options.plotOptions.series){
        chart.options.plotOptions.series = {};
      }
      if(!chart.options.plotOptions.series.events){
        chart.options.plotOptions.series.events = {};
      }
      chart.update({
        plotOptions:{
          series:{
            events: {
              legendItemClick: function (e) {
                e.preventDefault();
                var index = -1;
                var legendClickedChart = this.chart;
                var isStockChart = false;
                if(legendClickedChart.rangeSelector || legendClickedChart.navigator){
                  isStockChart = true;
                }
                if(legendClickedChart.options.chart.__visibleSeries.length === 1 && legendClickedChart.options.chart.__visibleSeries[0] === this.name){
                  // make all legend items visible
                  legendClickedChart.series.forEach(function (serie) {
                    serie.setVisible(true, false);
                  });
                  legendClickedChart.options.chart.__visibleSeries.length = 0;
                  this.redraw();
                  return false;
                }
                if(!legendClickedChart.options.chart.__visibleSeries.includes(this.name)){
                  legendClickedChart.options.chart.__visibleSeries.push(this.name);
                }else{
                  this.setVisible(false);
                  index = legendClickedChart.options.chart.__visibleSeries.indexOf(this.name);
                  legendClickedChart.options.chart.__visibleSeries.splice(index, 1);
                  return false;
                }
                // deselect all the series which are not in the __visibleSeries array;
                // don't consider navigator series
                legendClickedChart.series.forEach(function (serie) {
                  if(!serie.name.includes('Navigator')){
                    if(legendClickedChart.options.chart.__visibleSeries.includes(serie.name)){
                      serie.setVisible(true, false);
                    }else{
                      serie.setVisible(false, false);
                    }
                  }
                });
                var totalSeriesLength = legendClickedChart.series.length;
                if(isStockChart && legendClickedChart.navigator.navigatorEnabled){
                  totalSeriesLength = legendClickedChart.series.length - legendClickedChart.navigator.series.length;
                }
                if(legendClickedChart.options.chart.__visibleSeries.length === totalSeriesLength){
                  legendClickedChart.options.chart.__visibleSeries.length = 0;
                }
                this.redraw();
              }
            }
          }
        }
      })
    }
  });
}(Highcharts));
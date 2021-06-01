(function (H) {

  H.wrap(H.Chart.prototype, 'init', function (proceed) {
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    var chart = this;
    var isReversed = !!chart.legend.options.reverseClick;
    
    chart.update({
      chart: {
        __visibleSeries: []
      }
    });
    if(isReversed){
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
                var chart = this.chart;
                var isStockChart = false;
                if(chart.rangeSelector || chart.navigator){
                  isStockChart = true;
                }
                if(chart.options.chart.__visibleSeries.length === 1 && chart.options.chart.__visibleSeries[0] === this.name){
                  // make all legend items visible
                  chart.series.forEach(function (serie) {
                    serie.setVisible(true, false);
                  });
                  chart.options.chart.__visibleSeries.length = 0;
                  this.redraw();
                  return false;
                }
                if(!chart.options.chart.__visibleSeries.includes(this.name)){
                  chart.options.chart.__visibleSeries.push(this.name);
                }else{
                  this.setVisible(false);
                  index = chart.options.chart.__visibleSeries.indexOf(this.name);
                  chart.options.chart.__visibleSeries.splice(index, 1);
                  return false;
                }
                // deselect all the series which are not in the __visibleSeries array;
                // don't consider navigator series
                chart.series.forEach(function (serie) {
                  if(!serie.name.includes('Navigator')){
                    if(chart.options.chart.__visibleSeries.includes(serie.name)){
                      serie.setVisible(true, false);
                    }else{
                      serie.setVisible(false, false);
                    }
                  }
                });
                var totalSeriesLength = chart.series.length;
                if(isStockChart && chart.navigator.navigatorEnabled){
                  totalSeriesLength = chart.series.length - chart.navigator.series.length;
                }
                if(chart.options.chart.__visibleSeries.length === totalSeriesLength){
                  chart.options.chart.__visibleSeries.length = 0;
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
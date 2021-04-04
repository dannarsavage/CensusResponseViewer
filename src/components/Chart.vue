<template>
  <div class="chartContainer">
    <div id="title"></div>
    <div id="chart"></div>
  </div>
</template>

<script>
import { CensusCountyReference } from "./CensusCountyReference";
import { CensusResponseRateClient } from "./CensusResponseRateClient";
//import { CensusResponseRateInformation } from "./CensusResponseRateInformation";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default {
  name: 'Chart',
  props: {
    countyReference: CensusCountyReference  // County whose data needs to be charted
  },
  data() {
    return {
      chart: null,
      responseClient: null,
      responseInfo: null
    }
  },
  mounted() {
    am4core.useTheme(am4themes_animated);    
    this.responseClient = new CensusResponseRateClient('https://api.census.gov/data/2020/dec/responserate');
    this.chart = this.initializeChart(); 
  },
  watch: {
    /**
     * Watch the countyReference prop for changes to change chart
     * @param   {CensusCountyReference}      val    County to chart
     */
    countyReference: async function (val) {
      if (val) {
        this.setCounty(val);
      }
    }
  },
  methods: {
    /**
     * Emit an event that the county has been updated
     * @param   {CensusCountyReference}      val    County information to chart
     */
    setCounty: async function (val) {
      this.responseInfo = await this.responseClient.getResponseRateForCountyAndState(val);
      document.getElementById("title").innerText = `2020 Census Response Rates for ${val.FullName}`;
      await this.setChartData(this.responseInfo);
    },
    /**
     * Replace chart data with new county's data
     * @param   {CensusResponseRateInformation}      data    County data to chart
     */
    setChartData: async function(data) {
      const totalResponseRate = data.CumulativeTotalResponseRate;
      const internetResponseRate = data.CumulativeInternetResponseRate;
      const noResponseRate = 100 - totalResponseRate;
      const mailedResponseRate = totalResponseRate - internetResponseRate;

      this.chart.data = [{
        "responseType": "No Response",
        "responseRate": noResponseRate
      }, {
        "responseType": "Mailed",
        "responseRate": mailedResponseRate
      }, {
        "responseType": "Internet",
        "responseRate": internetResponseRate
      }];
    },
    /**
     * Sets up an empty chart ready to receive data
     */
    initializeChart: function() {
      const chart = am4core.create("chart", am4charts.PieChart);
      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "responseRate";
      pieSeries.dataFields.category = "responseType";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;

      chart.hiddenState.properties.radius = am4core.percent(0);
      return chart;
    }
  },
  /**
   * Removes the chart to conserve memory (I guess)
   */
  beforeDestroy() {
    if (this.chart) {
      this.chart = null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  display: inline-block;
}
.chartContainer {
  background-color: white;
  padding: 10px;
  z-index: inherit;
}

#title {
  color: navy;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  min-height: 25px;
  z-index: inherit;
}

#chart {
  width: 100%;
  z-index: inherit;
}
</style>

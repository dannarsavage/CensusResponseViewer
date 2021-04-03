<template>
  <div class="chartContainer">
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
    countyReference: CensusCountyReference
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
    this.chart = am4core.create("chart", am4charts.PieChart);
  },
  watch: {
    countyReference: async function (val) {
      if (val) {
        this.setCounty(val);
      }
    }
  },
  methods: {
    setCounty: async function (val) {
      // TODO: Get data from the census for the county and use it to update the chart
      this.responseInfo = await this.responseClient.getResponseRateForCountyAndState(val);
      await this.updateChartWithData(this.responseInfo);
      //console.log(`${this.responseInfo.Name}: ${this.responseInfo.CumulativeTotalResponseRate}`);
    },
    updateChartWithData: async function(data) {
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
      // Add and configure Series
      let pieSeries = this.chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "responseRate";
      pieSeries.dataFields.category = "responseType";
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;

      this.chart.hiddenState.properties.radius = am4core.percent(0); 
   }
  },
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
  width: 50vw;
  background-color: red;
  padding: 10px;
  z-index: inherit;
}
#chart {
  width: 100%;
  height: 40vw;
  background-color: green;
  z-index: inherit;
}
</style>

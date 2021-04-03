<template>
  <div class="chartContainer">
    <div id="chart"></div>
  </div>
</template>

<script>
import { CensusCountyReference } from "./CensusCountyReference";
import { CensusResponseRateClient } from "./CensusResponseRateClient";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export default {
  name: 'Chart',
  props: {
    countyReference: CensusCountyReference
  },
  data() {
    return {
      responseClient: null
    }
  },
  mounted() {
    console.log(am4core);
    console.log(am4charts);
    this.responseClient = new CensusResponseRateClient('https://api.census.gov/data/2020/dec/responserate');
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
      const thing = this.responseClient.getResponseRateForCountyAndState(val);
      console.log(thing);
    }
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
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

<template>
  <div id="app">
    <h1>Inspect Census Response Rates by County</h1>
    <div id="SearchOptions">
      <div class ="SearchOption" id="CountyDiv">
        Search by county name...
        <CountyPicker
          v-bind:countyReference.sync="chosenCounty" />
      </div>
    </div>
    <div id="MapDiv">
      <CountyMap 
        v-bind:chosenCountyReference.sync="chosenCounty"
        v-bind:countyReference.sync="chosenCounty" />
    </div>
    <div id="ChartDiv">
      <Chart 
        v-bind:countyReference="chosenCounty" />
    </div>
  </div>
</template>

<script>
import Chart from './components/Chart.vue'
import CountyMap from './components/Map copy.vue'
import CountyPicker from './components/CountyPicker.vue'

export default {
  data() {
    return {
      chosenCounty: undefined
    }
  },
  name: 'App',
  components: {
    CountyMap,
    CountyPicker,
    Chart
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  position: relative;
  width: 95vw;
}

div#SearchOptions {
  background-color: salmon;
  width: 100%;
  height: 85px;
  z-index: 90;
}

div#SearchOptions div.SearchOption {
  border: 1px solid navy;
  border-radius: 8px;
  padding: 5px;
  z-index: inherit;
}

div#CountyDiv {
  position: absolute;
  background-color: whitesmoke;
}

div#MapDiv {
  z-index: 0;
}

div#ChartDiv {
  border: 1px solid gray;
  position: absolute;
  width: 45vw;
  left: 49vw;
  top: 100px;
  z-index: 500;
}
</style>

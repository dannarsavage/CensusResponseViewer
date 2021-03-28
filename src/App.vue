<template>
  <div id="app">
    <h1>Inspect Census Response Rates by County</h1>
    <div id="SearchOptions">
      <div class ="SearchOption" id="CountyDiv">
        Search by county name...
        <CountyPicker
          v-bind:countyReference.sync="countyReference" />
      </div>
    </div>
    <div id="MapDiv">
      <Map 
        v-bind:countyReference="countyReference" />
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import CountyPicker from './components/CountyPicker.vue'
import { MapExtent } from "./components/MapExtent"

export default {
  data() {
    return {
      latitude: 44,
      longitude: -116.5,
      zoomLevel: 3,
      mapTitle: 'Nothing Yet',
      countyReference: undefined
    }
  },
  name: 'App',
  components: {
    Map,
    CountyPicker
  },
  computed: {
    mapExtent: function () {
      return new MapExtent (this.latitude, this.longitude, this.zoomLevel);
    }
  },
  methods: {
  },
  watch: {
    countyReference: {
      handler (new_value) {
        console.log(`In App's countyReference watcher with ${new_value.FullName}`);
      },
      deep: true
    }
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
</style>

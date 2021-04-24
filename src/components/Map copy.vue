<template>
  <div class="mapContainer">
    <div id="mapDivDan"></div>
  </div>
</template>

<script>
import esriConfig from '@arcgis/core/config';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { CensusCountyReference } from "./CensusCountyReference";
import { CensusCountyClient } from './CensusCountyClient';

export default {
  name: 'CountyMap',
  props: {
    countyReference: CensusCountyReference,       // County chosen by user -- used by other components to communicate with this one
    chosenCountyReference: CensusCountyReference  // County chosen by user clicking on the map -- used to emit events to other components
  },
  data() {
    return {
      map: null,
      countyLayerGroup: null,
      countyClient: null,
      mapDoubleClickTimer: null
    }
  },
  mounted() {
    this.initializeMap();
    this.countyClient = new CensusCountyClient('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1');
  },
  watch: {
    /**
     * Watches for new counties selected by user and updates the map to reflect updated values 
     * @param   {CensusCountyReference}      val    Info for county selected by user
     */
    countyReference: async function (val) {
      if (val) {
        this.setCounty(val);
      }
    }
  },
  methods: {
    /**
     * Clears the previous county from the map and places the new county shape
     * @param   {CensusCountyReference}      countyReference    Info for county to be added to map
     */
    setCounty: async function (countyReference) {
      //this.clearCounties();
      countyReference;
      // const countyEsriShape = await this.retrieveShape(countyReference);
      // const countyShape = this.convertEsriPolygonToLeaflet(countyEsriShape);
      // countyShape.addTo(this.countyLayerGroup);
      // this.map.flyToBounds(countyShape.getBounds());
    },
    /**
     * Set up the map during component initialization
     */
    initializeMap: function () {
      esriConfig.apiKey = "AAPK961d3c1dd1b441e4b3df0cac9aec9cecI1aP_0TyIHQA8lLxTR_N9v33pejv0BsS5i0GV0zoch6vVUXHrD4lMaRM-qSDv5p2";

      // let countiesRenderer = {
      //   type: "simple",  // autocasts as new SimpleRenderer()
      //   symbol: {
      //     type: "simple-fill",
      //     color: [ 51, 51, 204, 0.9 ],
      //     style: "solid",
      //     outline: {  // autocasts as new SimpleLineSymbol()
      //       color: "white",
      //       width: 1
      //     }
      //   }
      // };

      const countiesLayer = new FeatureLayer({
        url: "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1",
        // renderer: countiesRenderer
      });

      console.log(countiesLayer.visible);

      const map = new Map({
        basemap: "arcgis-topographic" // Basemap layer service
      });

      map.add(countiesLayer);

      const mapView = new MapView({
        map: map,
        center: [-116.5, 44], // Longitude, latitude
        zoom: 3, // Zoom level
        container: "mapDivDan" // Div element
      });
      return mapView;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  display: inline-block;
}
.mapContainer {
  width: 50vw;
  background-color: lightskyblue;
  padding: 5px;
  z-index: inherit;
}
#mapDivDan {
  width: 100%;
  height: 40vw;
  background-color: steelblue;
  z-index: inherit;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

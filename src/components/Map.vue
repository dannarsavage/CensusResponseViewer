<template>
  <div class="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { CensusCountyReference } from "./CensusCountyReference";
import { CensusCountyClient } from './CensusCountyClient';

export default {
  name: 'Map',
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
    this.map = this.initializeMap();
    this.countyLayerGroup = L.layerGroup().addTo(this.map);
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
     * Removes the county shape from the map
     */
    clearCounties: function () {
      this.countyLayerGroup.eachLayer ( (layer) => {
          layer.removeFrom(this.countyLayerGroup);
        }
      );
    },
    /**
     * Clears the previous county from the map and places the new county shape
     * @param   {CensusCountyReference}      countyReference    Info for county to be added to map
     */
    setCounty: async function (countyReference) {
      this.clearCounties();
      if (countyReference.Shape === null) {
        countyReference.Shape = await this.retrieveShape(countyReference);
      }
      const countyShape = this.convertEsriPolygonToLeaflet(countyReference.Shape);
      countyShape.addTo(this.countyLayerGroup);
      this.map.flyToBounds(countyShape.getBounds());
    },
    /**
     * Retrieves a shape (as an Esri polygon) for a given county
     * @param   {CensusCountyReference}      countyReference    Info for county to be retrieved
     */
    retrieveShape: async function(countyReference) {
      const countyReturn = await this.countyClient.getCountyByStateAndCountyId (
      countyReference.StateId, countyReference.CountyId, true);
      return countyReturn.Shape;
    },
    /**
     * Converts an esri polygon to a Leafelet polygon 
     * @param   {object}      esriPolygon    Esri polygon to be converted
     */
    convertEsriPolygonToLeaflet: function (esriPolygon) {
      const ring = esriPolygon.rings[0];
      const latlngs = [];
      ring.forEach(element => {
        latlngs.push([element[1],element[0]]);
      });
      return L.polygon(latlngs, {color: 'red'});
    },
    /**
     * Handle single-click event 
     *    - allows user to select a county by clicking on the map
     *    - checks/sets double-click timer to prevent handling of single-click events during double-clicks
     * https://stackoverflow.com/questions/29035896/leaflet-dont-fire-click-event-function-on-doubleclick
     * @param   {event}      e    Event parameters containing location of click
     */
    clickAction: async function (e) {
      if (this.mapDoubleClickTimer !== null) {
        return;
      }
      this.mapDoubleClickTimer = setTimeout(async () => {

        if (
            !e.originalEvent.altKey 
            && !e.originalEvent.ctrlKey 
            && !e.originalEvent.shiftKey) 
          {
          const latitude = e.latlng.lat;
          const longitude = e.latlng.lng;
          const countyReturn = await this.countyClient.getCountyAtLatLong (latitude, longitude, true);
          this.emitCounty(countyReturn);
        }

        this.mapDoubleClickTimer = null;
      }, 200);
    },
    /**
     * Handle double-click event - simply resets the double-click timer to prevent handling of single-click events
     * https://stackoverflow.com/questions/29035896/leaflet-dont-fire-click-event-function-on-doubleclick
     * @param   {event}      e    Event parameters (unused so absent, but can be replaced if needed)
     */
    doubleClickAction: async function () {
      clearTimeout(this.mapDoubleClickTimer);
      this.mapDoubleClickTimer = null;
    },
    /**
     * Emit an event that the county has been updated
     * @param   {CensusCountyReference}      countyReference    County information to return
     */
    emitCounty: function(countyReference) {
      this.$emit('update:chosenCountyReference', countyReference);
    },
    /**
     * Set up the map during component initialization
     */
    initializeMap: function () {
      const map = L.map("map");
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      map.setView([44,-116.5],3);
      map.on('click', this.clickAction);
      map.on('dblclick', this.doubleClickAction);
      return map;
    }
  },
  /**
   * Removes the map to conserve memory (I guess)
   */
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
.mapContainer {
  width: 50vw;
  background-color: lightskyblue;
  padding: 5px;
  z-index: inherit;
}
#map {
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

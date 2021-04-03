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
    countyReference: CensusCountyReference
  },
  data() {
    return {
      map: null,
      countyLayerGroup: null,
      countyClient: null
    }
  },
  mounted() {
    this.map = L.map("map");
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.countyLayerGroup = L.layerGroup().addTo(this.map);
    this.map.setView([44,-116.5],3);
    this.countyClient = new CensusCountyClient('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1');
  },
  watch: {
    countyReference: async function (val) {
      if (val) {
        this.setCounty(val);
      }
    }
  },
  methods: {
    clearCounties: function () {
      this.countyLayerGroup.eachLayer ( (layer) => {
          layer.removeFrom(this.countyLayerGroup);
        }
      );
    },
    setCounty: async function (val) {
      this.clearCounties();
      if (val.Shape ===null) {
        const countyReturn = await this.countyClient.getCountyByStateAndCountyId (val.StateId, val.CountyId, true);
        // TODO: Do the work of converting from an Esri geometry to a leaflet geometry somewhere else
        const ring = countyReturn.Shape.rings[0];
        const latlngs = [];
        ring.forEach(element => {
          latlngs.push([element[1],element[0]]);
        });
        val.Shape = L.polygon(latlngs, {color: 'red'}).addTo(this.countyLayerGroup);
      }
      this.map.flyToBounds(val.Shape.getBounds());
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
.mapContainer {
  width: 50vw;
  background-color: lightskyblue;
  padding: 10px;
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

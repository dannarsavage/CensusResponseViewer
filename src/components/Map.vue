<template>
  <div class="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapExtent } from "./MapExtent"
import { CensusCountyReference } from "./CensusCountyReference"
import { CensusCountyClient } from './CensusCountyClient';

export default {
  name: 'Map',
  props: {
    title: String,
    mapExtent: MapExtent,
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
    this.setView(new MapExtent());
    this.countyClient = new CensusCountyClient('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1');
  },
  watch: {
    mapExtent: function (val) {
      console.log(`in mapExtent Watch: ${val}`);
      if (val) {
        this.setView(val);
      }
    },
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
      const countyReturn = await this.countyClient.getCountyByStateAndCountyId (val.StateId, val.CountyId, true);
      // TODO: Do the work of converting from an Esri geometry to a leaflet geometry somewhere else
      const ring = countyReturn.Shape.rings[0];
      const latlngs = [];
      ring.forEach(element => {
        latlngs.push([element[1],element[0]]);
      });
      const polygon = L.polygon(latlngs, {color: 'red'}).addTo(this.countyLayerGroup);
      this.map.flyToBounds(polygon.getBounds());
    },
    setView: function (mapExtent) {
        this.map.setView([mapExtent.latitude, mapExtent.longitude], mapExtent.zoomLevel);
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

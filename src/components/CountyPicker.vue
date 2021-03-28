<template>
  <div class="CountyPicker">
    <div 
      @click="searchForCounties"
      id="SearchButton">Search</div>
    <input 
      id="CountySearchStringInput"
      v-model="countySearchString"
      @keyup.enter="searchForCounties"
      placeholder="Search for Counties"
      type="String" />
    <div class="CountySearchWarning" id="NoCountiesFound" ref="NoCountiesFound">No counties found</div>
    <div class="CountySearchWarning" id="AtLeastTwoLetters" ref="AtLeastTwoLetters">Search needs two or more characters</div>
    <ul id="CountyList">
      <li v-for="county in countyList" :key="county.key">
        <div class="CountyButton" 
          @click="returnCounty(county)">
          {{ county.FullName }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { CensusCountyClient } from "./CensusCountyClient";

export default {
  name: 'CountyPicker',
  data() {
    return {
      countySearchString: '',
      countyList: [],
      stateId: '',
      countyId: '',
      countyName: '',
      stateAbbreviation: ''
    }
  },
  mounted() {
    this.countyClient = new CensusCountyClient('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1');
  },
  methods: {
    /**
     * Search for counties based on the contents of the text input
     */
    async searchForCounties() {
      this.clearWarnings();
      this.clearCountyList();
      if (this.countySearchString.length <= 1) {
        if (this.countySearchString.length === 1) {
          this.warnMinimumSearchLength();
        }
        return;
      }
      this.countyList = await this.countyClient.getCountiesByName(this.countySearchString, false);
      if (this.countyList.length === 0) {
        this.warnNoCountiesFound();
      }
    },
    /**
     * Emit an event that the county has been updated
     * @parameter   {CensusCountyReference}      countyReference    County information to return
     */
    returnCounty(countyReference) {
      console.log(`In returnCounty with ${countyReference.FullName}`);
      this.clearCountyList();
      this.stateId = countyReference.StateId;
      this.countyId = countyReference.CountyId;
      this.countyName = countyReference.Name;
      this.stateAbbreviation = countyReference.State;
      this.$emit('update:countyReference', countyReference);
    },
    /**
     * Remove all counties from the county list 
     * TODO:  Should likely also have a way to collapse the list without purging the array
     */
    clearCountyList () {
        this.countyList = [];
    },
    /**
     * Warn the user that the search requires at least two characters
     */
    warnMinimumSearchLength () {
        this.$refs.AtLeastTwoLetters.style.display = "block";
    },
    /**
     * Warn the user that the search returned no results
     */
    warnNoCountiesFound () {
        this.$refs.NoCountiesFound.style.display = "block";
    },
    /**
     * Clear warnings before performing another search
     */
    clearWarnings () {
      this.$refs.NoCountiesFound.style.display = "none";
      this.$refs.AtLeastTwoLetters.style.display = "none";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /*display: inline-block;*/
  margin: 0 10px;
}
a {
  color: #42b983;
}
input#CountySearchStringInput {
  margin: 10px;
  width: 180px;
}
div.CountySearchWarning {
  background-color: white;;
  color: red;
  display: none;
}
div.CountyPicker {
  text-align: left;
  width: 320px;
  font-size: 13px;
  /* border: 1px solid blue; */
  z-index: inherit;
}
div.CountyButton {
  background-color: mediumslateblue;
  border-radius: 4px;
  cursor: pointer;
  height: 20px;
  margin: 5px;
  padding: 5px;
  text-align: center;
  color: white;
  font-weight: bold;
  /* vertical-align:; */
  z-index: inherit;
}
div#SearchButton {
  background-color: slategray;
  border-radius: 3px;
  cursor: pointer;
  height: 20px;
  width: 100px;
  margin: 5px;
  margin-right: 10px;
  padding: 5px;
  text-align: center;
  color: white;
  font-weight: bold;
  position: absolute;
  right: 0px;
  /* vertical-align:; */
}
</style>

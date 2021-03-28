const fetch = require("node-fetch");

/**
 * API client to retrieve county information from latitude and longitude
 */
 export class CensusStateClient {
    constructor (url) {
        this.baseUrl = url;  // https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0
    }

    /**
     * Get state info by state ID
     * @param {Number}  stateId         State ID to query
     */
    async getStateNameByStateId (stateId) {
        if (!this.stateInfoDictionary){
            this.stateInfoDictionary = await this.getAllStateInfo();
        }
        return this.stateInfoDictionary[stateId];
    }

    /**
     * Get state info by state ID
     */
    async getAllStateInfo () {
        const url = `${this.baseUrl}/query?where=0%3D0&outFields=STATE,STUSAB&returnGeometry=false&returnIdsOnly=false&f=json`;
        const response = await fetch(url);
        const responseObject = await response.json();
        const stateInfoArray = responseObject.features;
        const stateDict = {}
        for (var stateInfo of stateInfoArray) {
            const stateAttributes = stateInfo.attributes;
            stateDict[stateAttributes.STATE] = stateAttributes.STUSAB;
        }
        return stateDict;
    }
}
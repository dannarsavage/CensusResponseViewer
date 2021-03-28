import { CensusCountyReference } from "./CensusCountyReference";
import { CensusStateClient } from "./CensusStateClient";
const fetch = require("node-fetch");

/**
 * API client to retrieve county information from latitude and longitude
 */
 export class CensusCountyClient {
    constructor (url) {
        this.baseUrl = url;  // https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1
        this.stateClient = new CensusStateClient('https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0');
    }

    /**
     * Get county info by state ID and county ID
     * @param {Number}  stateId         State ID to query
     * @param {Number}  countyId        County ID to query
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountyByStateAndCountyId (stateId, countyId, returnGeometry = false) {
        const state = `${stateId}`.padStart(2, "0");    // StateIds in this API are always two characters long
        const county = `${countyId}`.padStart(3, "0");  // CountyIds in this API are always two characters long
        const url = `${this.baseUrl}/query?where=STATE%3D${state} and COUNTY%3D${county}&outFields=COUNTY,STATE,NAME&returnGeometry=${returnGeometry}&returnIdsOnly=false&f=json`;
        const response = await fetch(url);
        const responseObject = await response.json();
        const countyInfo = responseObject.features[0].attributes;
        return this.makeReferenceFromApiReturn (countyInfo);
    }

    /**
     * Get county & state from a lat/long coordinate pair
     * @param {Number} latitude     Latitude to query
     * @param {Number} longitude    Longitude to query
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountyAtLatLong (latitude, longitude, returnGeometry = false) {
        const geom = `{ "x": ${longitude}, "y": ${latitude}, "spatialReference": { "wkid": 4326 } }`;  // TODO: Turn the lat/lon into a shape digestible by this API
        const url = `${this.baseUrl}/query?geometry=${geom}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=COUNTY,STATE,NAME&returnGeometry=${returnGeometry}&returnIdsOnly=false&f=json`;
        const response = await fetch(url);
        const responseObject = await response.json();
        const countyInfo = responseObject.features[0].attributes;
        return this.makeReferenceFromApiReturn (countyInfo);
    }

    /**
     * Get county & state from a name or portion of a name
     * @param {string} namePortion      Name (or portion of a name) for which to query
     * @param {boolean} startsWith      Search string must be at the start of the county name (default to true)
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountiesByName (namePortion, startsWith = true, returnGeometry = false) {
        const wildcard = startsWith ? '' : '%25';
        const url = `${this.baseUrl}/query?where=UPPER(NAME)+LIKE+'${wildcard}${ namePortion.toUpperCase() }%25'&outFields=COUNTY,STATE,NAME&returnGeometry=${returnGeometry}&returnIdsOnly=false&f=json`;
        const response = await fetch(url);
        const responseObject = await response.json();
        const countyInfoArray = responseObject.features;
        const returnArray = [];
        // const countyInfo = countyInfoArray[0];
        // const countyReference = await this.makeReferenceFromApiReturn (countyInfo.attributes);
        // returnArray.push(countyReference);
        for await (var countyInfo of countyInfoArray) {
            const countyReference = await this.makeReferenceFromApiReturn (countyInfo.attributes);
            returnArray.push(countyReference);
        }
        return returnArray;
    }

    /**
     * Take one feature from the service and turn it into a CensusCountyReference
     * @param {object} apiReturn     One feature from the map service
     */
     async makeReferenceFromApiReturn (apiReturn) {
        const stateName = await this.getStateNameByStateId(apiReturn.STATE);
        return new CensusCountyReference(
            apiReturn.STATE,
            apiReturn.COUNTY,
            apiReturn.NAME,
            stateName
        );
    }

    /**
    * Get state info by state ID
    * @param {Number}  stateId         State ID to query
    * TODO:  I might end up getting state geometries too . . .
    */
     async getStateNameByStateId (stateId) {
        return await this.stateClient.getStateNameByStateId(stateId);
    }
}
import { CensusCountyReference } from "./CensusCountyReference";
import { CensusStateClient } from "./CensusStateClient";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Point from '@arcgis/core/geometry/Point';

/**
 * API client to retrieve county information from latitude and longitude
 */
 export class CensusCountyClient {
    constructor (url) {
        this.featureLayer = new FeatureLayer({url: url});
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
        const query = this.featureLayer.createQuery();
        query.where = `STATE = ${state} and COUNTY = ${county}`;
        query.outFields = ['COUNTY', 'STATE', 'NAME'];
        query.outSpatialReference = { wkid: 4326 };
        query.returnGeometry = returnGeometry
        const response = await this.featureLayer.queryFeatures(query);
        return await this.makeReferenceFromFeature(response.features[0]);
    }

    /**
     * Get county & state from a lat/long coordinate pair
     * @param {Number} latitude     Latitude to query
     * @param {Number} longitude    Longitude to query
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountyAtLatLong (latitude, longitude, returnGeometry = false) {
        const pointProperties = {
            latitude: latitude, 
            longitude: longitude,
            spatialReference: {
                wkid: 4326
            }
        };
        const point = new Point(pointProperties);
        const query = this.featureLayer.createQuery();
        //const geom = `{ "x": ${longitude}, "y": ${latitude}, "spatialReference": { "wkid": 4326 } }`;  // TODO: Turn the lat/lon into a shape digestible by this API
        query.outFields = ['COUNTY', 'STATE', 'NAME'];
        query.geometry = point;
        query.spatialRelationship = "intersects";
        query.returnGeometry = returnGeometry
        query.outSpatialReference = { wkid: 4326 };
        const response = await this.featureLayer.queryFeatures(query);
        return await this.makeReferenceFromFeature(response.features[0]);
    }

    /**
     * Get county & state from a name or portion of a name
     * @param {string} namePortion      Name (or portion of a name) for which to query
     * @param {boolean} startsWith      Search string must be at the start of the county name (default to true)
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountiesByName (namePortion, startsWith = true, returnGeometry = false) {
        const wildcard = startsWith ? '' : '%';
        const query = this.featureLayer.createQuery();
        query.where = `UPPER(NAME) LIKE '${wildcard}${ namePortion.toUpperCase() }%'`;
        query.outFields = ['COUNTY', 'STATE', 'NAME'];
        query.returnGeometry = returnGeometry
        query.outSpatialReference = { wkid: 4326 };
        const response = await this.featureLayer.queryFeatures(query);
        const countyInfoArray = response.features;
        const returnArray = [];
        for await (var countyInfo of countyInfoArray) {
            const countyReference = await this.makeReferenceFromFeature(countyInfo);
            returnArray.push(countyReference);
        }
        return returnArray;
    }

    /**
     * Take one feature from the service and turn it into a CensusCountyReference
     * @param {object} feature     One feature from the map service
     */
    async makeReferenceFromFeature (feature) {
        const apiReturn = feature.attributes;
        const stateName = await this.getStateNameByStateId(apiReturn.STATE);
        return new CensusCountyReference(
            apiReturn.STATE,
            apiReturn.COUNTY,
            apiReturn.NAME,
            stateName,
            feature.geometry
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
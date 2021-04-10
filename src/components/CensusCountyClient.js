import { CensusCountyReference } from "./CensusCountyReference";
import { CensusStateClient } from "./CensusStateClient";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
//import Point from '@arcgis/core/geometry/Point';
import {FeatureLayerService/*, Query*/}  from 'esri-leaflet';
import L from "leaflet";

/**
 * API client to retrieve county information from latitude and longitude
 */
 export class CensusCountyClient {
    constructor (url) {
        this.featureLayerService = new FeatureLayerService({url: url});
        this.featureLayer = new FeatureLayer({url: url});
        //this.baseUrl = url;  // https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1
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
        const whereClause = `STATE = ${state} and COUNTY = ${county}`;
        const q = this.featureLayerService.query();
        q.where(whereClause);
        q.returnGeometry(returnGeometry);
        this.thingy = null;
        q.run(async function (error, featureCollection) {
          if (error) {
            console.log(error);
            return;
          }

          const feature = featureCollection.features[0];
          this.thingy = await this.makeReferenceFromFeature2(feature);
        }, this);
        console.log(this.thingy);
        return this.thingy;
    }

    /**
     * Get county & state from a lat/long coordinate pair
     * @param {Number} latitude     Latitude to query
     * @param {Number} longitude    Longitude to query
     * @param {Boolean} returnGeometry  Whether or not to return geometries (default to false since they're expensive)
     */
    async getCountyAtLatLong (latitude, longitude, returnGeometry = false) {
        const q = this.featureLayerService.query();
        q.fields(['COUNTY', 'STATE', 'NAME']);
        q.intersects(L.latLng(latitude,longitude));
        q.returnGeometry(returnGeometry);
        this.thingy = null;
        q.run(async function (error, featureCollection) {
          if (error) {
            console.warn(error);
            return;
          }
          const feature = featureCollection.features[0];
          this.thingy = await this.makeReferenceFromFeature2(feature);
        }, this);
        console.log(this.thingy);
        return this.thingy;
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
     * Take one feature from the service and turn it into a CensusCountyReference
     * @param {object} feature     One feature from the map service
     */
    async makeReferenceFromFeature2 (feature) {
        const apiReturn = feature.properties;
        const stateName = await this.getStateNameByStateId(apiReturn.STATE);
        if (!feature.geometry) {
            console.warn("NO GEOMETRY");
        }
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
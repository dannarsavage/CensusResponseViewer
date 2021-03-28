import {CensusResponseRateInformation} from './CensusResponseRateInformation';
import {CensusCountyReference} from './CensusCountyReference';
const fetch = require("node-fetch");

/**
 * API client to retrieve census reponse rate information
 */
 export class CensusResponseRateClient {
    constructor (url) {
        this.baseUrl = url;  // https://api.census.gov/data/2020/dec/responserate
    }

    /**
     * Get census response rate from a county 
     * @param {CensusCountyReference} countyReference       County Reference
     */
     async getResponseRateForCountyAndState (countyReference) {
        const countyId = countyReference.CountyId;
        const stateId = countyReference.StateId;
        const url = `${this.baseUrl}?get=NAME,CRRALL,CRRINT&for=county:${countyId}&in=state:${stateId}`;
        const response = await fetch(url);
        const responseObject = await response.json();
        const values = responseObject[1];
        const returnInfo = new CensusResponseRateInformation(
            values[0],
            parseFloat(values[1]),
            parseFloat(values[2])
        );
        return returnInfo;
    }
}
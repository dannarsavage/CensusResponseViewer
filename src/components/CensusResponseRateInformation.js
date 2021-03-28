/**
 * Response rate information returned from census APIs
 * @property   {string}        Name                            Pretty name of the area for which this info is valid (typically a county)
 * @property   {Number}        CumulativeTotalResponseRate     Cumulative total response rate
 * @property   {Number}        CumulativeInternetResponseRate  Cumulative response rate via internet
 */
export class CensusResponseRateInformation {
    constructor(
        name = '',
        totalReponseRate = 0,
        internetReponseRate = 0
    ) { 
        this.Name = name;
        this.CumulativeTotalResponseRate = totalReponseRate;
        this.CumulativeInternetResponseRate = internetReponseRate;
    }
}
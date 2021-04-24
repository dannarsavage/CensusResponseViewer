/**
 * Information necessary to gather information from census APIs regarding a county
 * @property   {string}      StateId    Numeric string referring to a state
 * @property   {string}      CountyId   Numeric string referring to a county
 * @property   {string}      Name       Human-readable name of the county
 * @property   {string}      State      Human-readable name of the state
 */
 export class CensusCountyReference {
    constructor(
        stateId = '',
        countyId = '',
        name = '',
        state = ''
    ) {
        this.StateId = stateId;
        this.CountyId = countyId;
        this.Name = name;
        this.State = state;
    }

    get key() {
        return `${this.StateId}${this.CountyId}`;
    }
    
    get FullName() {
        return `${this.Name}, ${this.State}`;
    }
}
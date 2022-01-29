import { CensusCountyClient } from '../components/CensusCountyClient'

/**
 * Tests of CensusCountyEsriClient
 */

 test('getCountyAtLatLong should work', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1';
    const sut = new CensusCountyClient(api_url);
    const result = await sut.getCountyAtLatLong(43, -116.5);
    expect(result.StateId).toBe("16");
    expect(result.CountyId).toBe("073");
    expect(result.State).toBe("ID");
});

test('getCountiesByName should work', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1';
    const sut = new CensusCountyClient(api_url);
    const result = await sut.getCountiesByName("lacka");
    expect(result.filter( item => item.State === 'PA' ).length).toBe(1);
});

test('getCountiesByName should get multiple counties', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1';
    const sut = new CensusCountyClient(api_url);
    const result = await sut.getCountiesByName("lack", false);
    expect(result.length).toBeGreaterThan(1);
});

test('getCountyByStateAndCountyId should get a county', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1';
    const sut = new CensusCountyClient(api_url);
    const result = await sut.getCountyByStateAndCountyId("16", "073", false);
    //expect(result.Name).toBe("Valley");
    expect(result.State).toBe("ID");
});
import { CensusStateClient } from '../components/CensusStateClient'

/**
 * Tests of CensusStateClient
 */
 test('CensusStateClient should work', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0';
    const sut = new CensusStateClient(api_url);
    const result = await sut.getStateNameByStateId(16);
    expect(result).toBe("ID");
});

test('CensusStateClient should work', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0';
    const sut = new CensusStateClient(api_url);
    const result = await sut.getStateNameByStateId(42);
    expect(result).toBe("PA");
});

test('getAllStateInfo should work', async () => {
    const api_url = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0';
    const sut = new CensusStateClient(api_url);
    const result = await sut.getAllStateInfo();
    expect(Object.keys(result).length).toBeGreaterThan(49);
});

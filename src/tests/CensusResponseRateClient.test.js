import { CensusCountyReference } from '../components/CensusCountyReference';
import { CensusResponseRateClient } from '../components/CensusResponseRateClient'

/**
 * Tests of CensusResponseRateClient
 */
 test('CensusResponseRateClient should work', async () => {
    const api_url = 'https://api.census.gov/data/2020/dec/responserate';
    const countyReference = new CensusCountyReference ('16', '085');
    const sut = new CensusResponseRateClient(api_url);
    const result = await sut.getResponseRateForCountyAndState(countyReference);
    expect(result.Name).toBe("Valley County, Idaho");
    expect(result.CumulativeTotalResponseRate).toBeGreaterThan(0);
    expect(result.CumulativeInternetResponseRate).toBeGreaterThan(0);
});

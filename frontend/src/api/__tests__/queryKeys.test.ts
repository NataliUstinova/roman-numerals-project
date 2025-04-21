import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
  it('should return correct keys for conversions', () => {
    expect(queryKeys.conversions.all).toEqual(['conversions']);
    expect(queryKeys.conversions.list()).toEqual(['conversions', 'list']);
  });

  it('should return correct keys for toRoman conversion', () => {
    expect(queryKeys.conversion.toRoman('42')).toEqual(['conversion', 'toRoman', '42']);
  });

  it('should return correct keys for toNumber conversion', () => {
    expect(queryKeys.conversion.toNumber('XLII')).toEqual(['conversion', 'toNumber', 'XLII']);
  });
});
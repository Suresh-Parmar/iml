import rawCountries from './raw-countries';

export const getInternationalDailingCode = (countryName: string) => {
  return rawCountries.find((value) => value[0] === countryName)?.[3] ?? '';
};

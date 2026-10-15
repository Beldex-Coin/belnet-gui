/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';

/**
 * Country flags for the exit node list.
 *
 * Every PNG in images/country/ is picked up automatically, so adding a flag
 * only needs the file: no import here. Flags are looked up by the `country`
 * string from the exit node list, normalized so that case, accents, spaces,
 * underscores and hyphens don't matter ("Côte d'Ivoire", "cote_d_ivoire" and
 * "COTE D IVOIRE" all match Côte_d'Ivoire.png).
 */

/** Normalizes a country name or file name into a lookup key. */
export const normalizeCountryKey = (value?: string): string =>
  (value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/\.png$/, '')
    .replace(/['’.]/g, '') // apostrophes and dots
    .replace(/[^a-z0-9]+/g, ' ') // spaces, underscores, hyphens, ...
    .trim();

// webpack bundles every flag in the folder (file-loader gives each a URL).
// Numbered duplicates such as "France-1.png" are left out of the bundle.
const flagContext = (require as any).context(
  '../../../images/country',
  false,
  /^\.\/(?!.*-\d+\.png$).*\.png$/
);

const FLAGS_BY_KEY: Record<string, string> = {};
flagContext.keys().forEach((path: string) => {
  const fileName = path.replace(/^\.\//, '');
  const mod = flagContext(path);
  FLAGS_BY_KEY[normalizeCountryKey(fileName)] = mod?.default || mod;
});

/**
 * Other names the exit node list may use for a country, mapped to the
 * normalized key of an existing flag file. Also covers the misspelled and
 * short file names in images/country.
 */
const COUNTRY_ALIASES: Record<string, string> = {
  // short / common names
  us: 'usa',
  'united states': 'usa',
  'united states of america': 'usa',
  america: 'usa',
  uk: 'united kingdom',
  gb: 'united kingdom',
  'great britain': 'united kingdom',
  britain: 'united kingdom',
  england: 'united kingdom',
  russia: 'russian federation',
  'united arab emirates': 'uae',
  korea: 'south korea',
  'republic of korea': 'south korea',
  'korea republic of': 'south korea',
  czechia: 'czech republic',
  holland: 'netherlands',
  'the netherlands': 'netherlands',
  'ivory coast': 'cote divoire',
  'cote d ivoire': 'cote divoire',
  'bosnia and herzegovina': 'bosnia',
  'north macedonia': 'macedonia',
  eswatini: 'swaziland',
  'cabo verde': 'cape verde',
  burma: 'myanmar',
  'holy see': 'vatican city',
  vatican: 'vatican city',
  turkiye: 'turkey',
  'east timor': 'timor leste',
  macau: 'macao',
  'dr congo': 'democratic republic of the congo',
  drc: 'democratic republic of the congo',
  'congo kinshasa': 'democratic republic of the congo',
  congo: 'republic of the congo',
  'congo brazzaville': 'republic of the congo',
  'the bahamas': 'bahamas',
  'the gambia': 'gambia',
  'virgin islands': 'us virgin islands',
  'u s virgin islands': 'us virgin islands',
  'saint pierre and miquelon': 'saint pierre',
  'federated states of micronesia': 'micronesia',
  'viet nam': 'vietnam',
  'lao pdr': 'laos',
  'republic of moldova': 'moldova',
  'syrian arab republic': 'syria',
  'brunei darussalam': 'brunei',
  // file names with typos
  'solomon islands': 'soloman islands',
  'saint vincent and the grenadines': 'saint vicent and the grenadines',
  'st vincent and the grenadines': 'saint vicent and the grenadines',
  'st kitts and nevis': 'saint kitts and nevis',
  'st lucia': 'saint lucia'
};

/** Returns the bundled flag URL for a country name, or undefined. */
export const getCountryFlag = (country?: string): string | undefined => {
  const key = normalizeCountryKey(country);
  if (!key) {
    return undefined;
  }
  return FLAGS_BY_KEY[key] || FLAGS_BY_KEY[COUNTRY_ALIASES[key]];
};

const CountryFlagImg = styled.img`
  width: auto;
  height: 10px;
  padding-right: 10px;
`;

const CountryFlags = (props: any) => {
  const imgSrc = getCountryFlag(props.countryName);
  // no flag for this country: render nothing rather than a broken image
  if (!imgSrc) {
    return null;
  }
  return (
    <CountryFlagImg
      style={{ ...props.style }}
      id={props.keyItem}
      src={imgSrc}
      alt=""
    />
  );
};

export default React.memo(CountryFlags);

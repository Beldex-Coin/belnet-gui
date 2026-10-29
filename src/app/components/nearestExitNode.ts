/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Picks the exit node closest to this device.
 *
 *  - device location: latitude / longitude of the public IP (ipwho.is, with
 *    ipapi.co as fallback), looked up while NOT connected
 *  - node location: latitude / longitude from the published exit node list
 *  - distance: great-circle distance with the Haversine formula
 *  - when several nodes are equally near -- at the same location (within
 *    NEAREST_TIE_KM) or in the same country as the nearest node -- one of
 *    them is picked at random
 *  - "fast" nodes (speedScore > 0 in the list) are preferred over slow ones
 *    (speedScore = 0): see pickNearestFastExitNode
 */

export type GeoPoint = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;

/**
 * Nodes whose distance differs from the nearest one by no more than this are
 * treated as "equally near" and one is picked at random. Nodes hosted in the
 * same city / data centre share coordinates, so this only needs to absorb
 * rounding in the published coordinates.
 */
export const NEAREST_TIE_KM = 1;

const toRadians = (deg: number): number => (deg * Math.PI) / 180;

/** Haversine great-circle distance between two points, in kilometres. */
export const haversineKm = (a: GeoPoint, b: GeoPoint): number => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
};

/** Returns a valid point, or undefined if either coordinate is missing/out of range. */
export const toGeoPoint = (lat: unknown, lon: unknown): GeoPoint | undefined => {
  const latitude = toNumber(lat);
  const longitude = toNumber(lon);
  if (
    latitude === undefined ||
    longitude === undefined ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180 ||
    // 0,0 is what some sources send for "unknown"
    (latitude === 0 && longitude === 0)
  ) {
    return undefined;
  }
  return { latitude, longitude };
};

/**
 * Reads a node's coordinates from the exit node list entry. Accepts the
 * common spellings (latitude/longitude, lat/lon, lat/lng, lat/long), either on
 * the node itself or in a nested `location` / `geo` / `coordinates` object.
 */
export const getNodeLocation = (node: any): GeoPoint | undefined => {
  if (!node || typeof node !== 'object') {
    return undefined;
  }
  const sources = [node, node.location, node.geo, node.coordinates].filter(
    (s) => s && typeof s === 'object'
  );
  for (const s of sources) {
    const point = toGeoPoint(
      s.latitude ?? s.lat ?? s.Latitude,
      s.longitude ?? s.lon ?? s.lng ?? s.long ?? s.Longitude
    );
    if (point) {
      return point;
    }
  }
  return undefined;
};

export type NearestPick<T> = {
  node: T;
  distanceKm: number;
  /** how many nodes were equally near: same location or country (random pick among them) */
  tiedCount: number;
};

const countryKey = (node: any): string =>
  typeof node?.country === 'string'
    ? node.country
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
    : '';

/**
 * Returns the nearest node to `device`. When several nodes count as equally
 * near -- the same location as the nearest one (within NEAREST_TIE_KM) or
 * the same country -- one of them is chosen at random. Nodes without
 * coordinates, or explicitly marked inactive, are skipped. Undefined when no
 * node has usable coordinates.
 */
export const pickNearestExitNode = <T extends { name?: string; isActive?: any }>(
  nodes: Array<T>,
  device: GeoPoint,
  random: () => number = Math.random
): NearestPick<T> | undefined => {
  const measured = nodes
    .filter(
      (n) => n?.name && String(n.isActive ?? 'true').toLowerCase() !== 'false'
    )
    .map((node) => {
      const location = getNodeLocation(node);
      return location
        ? { node, distanceKm: haversineKm(device, location) }
        : undefined;
    })
    .filter(Boolean) as Array<{ node: T; distanceKm: number }>;

  if (measured.length === 0) {
    return undefined;
  }
  const nearest = measured.reduce((a, b) => (b.distanceKm < a.distanceKm ? b : a));
  const nearestCountry = countryKey(nearest.node);
  const tied = measured.filter(
    (m) =>
      m.distanceKm - nearest.distanceKm <= NEAREST_TIE_KM ||
      (nearestCountry !== '' && countryKey(m.node) === nearestCountry)
  );
  const choice = tied[Math.min(tied.length - 1, Math.floor(random() * tied.length))];
  return { node: choice.node, distanceKm: choice.distanceKm, tiedCount: tied.length };
};

/**
 * A node is "fast" when the published list gives it a speedScore above 0;
 * speedScore 0 (or missing / not a number) means slow.
 */
export const getSpeedScore = (node: any): number => {
  const score = toNumber(node?.speedScore);
  return score === undefined ? 0 : score;
};

export const isFastExitNode = (node: any): boolean => getSpeedScore(node) > 0;

export type NearestFastPick<T> = NearestPick<T> & {
  /** false when no fast node had coordinates and a slow one was picked */
  fast: boolean;
};

/**
 * The nearest FAST exit node (speedScore > 0), random among equally near
 * ones. Falls back to the nearest node of any speed when no fast node has
 * usable coordinates. Undefined when no node has coordinates at all.
 */
export const pickNearestFastExitNode = <
  T extends { name?: string; isActive?: any; speedScore?: any }
>(
  nodes: Array<T>,
  device: GeoPoint,
  random: () => number = Math.random
): NearestFastPick<T> | undefined => {
  const fastPick = pickNearestExitNode(nodes.filter(isFastExitNode), device, random);
  if (fastPick) {
    return { ...fastPick, fast: true };
  }
  const anyPick = pickNearestExitNode(nodes, device, random);
  return anyPick ? { ...anyPick, fast: false } : undefined;
};

/** A random fast node (any active node if none is fast), for when the device location is unknown. */
export const pickRandomFastExitNode = <
  T extends { name?: string; isActive?: any; speedScore?: any }
>(
  nodes: Array<T>,
  random: () => number = Math.random
): T | undefined => {
  const active = nodes.filter(
    (n) => n?.name && String(n.isActive ?? 'true').toLowerCase() !== 'false'
  );
  const fast = active.filter(isFastExitNode);
  const pool = fast.length ? fast : active;
  return pool.length
    ? pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]
    : undefined;
};

/** A random active node, for when the device location is unknown. */
export const pickRandomExitNode = <T extends { name?: string; isActive?: any }>(
  nodes: Array<T>,
  random: () => number = Math.random
): T | undefined => {
  const active = nodes.filter(
    (n) => n?.name && String(n.isActive ?? 'true').toLowerCase() !== 'false'
  );
  return active.length
    ? active[Math.min(active.length - 1, Math.floor(random() * active.length))]
    : undefined;
};

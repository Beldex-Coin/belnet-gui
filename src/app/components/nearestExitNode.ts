/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Picks the exit node closest to this device.
 *
 *  - device location: latitude / longitude of the public IP (ipwho.is, with
 *    ipapi.co as fallback), looked up while NOT connected
 *  - node location: latitude / longitude from the published exit node list
 *  - distance: great-circle distance with the Haversine formula
 *  - when several nodes are equally near (same location, within
 *    NEAREST_TIE_KM), one of them is picked at random
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
  /** how many nodes were equally near (the pick was random among them) */
  tiedCount: number;
};

/**
 * Returns the nearest node to `device`, choosing at random among nodes that
 * are equally near. Nodes without coordinates, or explicitly marked inactive,
 * are skipped. Undefined when no node has usable coordinates.
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
  const nearest = Math.min(...measured.map((m) => m.distanceKm));
  const tied = measured.filter((m) => m.distanceKm - nearest <= NEAREST_TIE_KM);
  const choice = tied[Math.min(tied.length - 1, Math.floor(random() * tied.length))];
  return { node: choice.node, distanceKm: choice.distanceKm, tiedCount: tied.length };
};

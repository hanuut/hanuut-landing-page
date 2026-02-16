import { COMMUNES } from "../data/algeria_locations";

// Converts numeric degrees to radians
const toRad = (value) => (value * Math.PI) / 180;

// Haversine Formula to calculate distance in KM
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Finds the nearest Algerian commune to the provided coordinates.
 * Returns the Wilaya Code, Name, and Commune Name.
 */
export const reverseGeocodeLocal = (userLat, userLng) => {
  if (!userLat || !userLng) return null;

  let nearestCommune = null;
  let minDistance = Infinity;

  // Iterate through all communes to find the closest one
  // Optimization: In a huge dataset, we might filter by crude lat/lng boundaries first, 
  // but for ~1500 items, a linear scan is instant in JS.
  for (const city of COMMUNES) {
    if (city.latitude && city.longitude) {
      const dist = calculateDistance(userLat, userLng, city.latitude, city.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCommune = city;
      }
    }
  }

  // If the nearest city is unreasonably far (e.g. > 500km), the user might not be in Algeria
  if (minDistance > 500) {
    return { error: "OUT_OF_COUNTRY" };
  }

  return {
    wilayaCode: nearestCommune.wilaya_code,
    wilayaName: nearestCommune.wilaya_name_ascii,
    communeName: nearestCommune.commune_name_ascii,
    distanceToCenter: minDistance
  };
};
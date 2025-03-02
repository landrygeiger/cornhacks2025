function juliandate(date: string): number {
  // Function to calculate Julian date (similar to the MATLAB implementation)
  const [year, month, day, hour, min, sec] = date.split(/[- :]/).map(Number);
  let adjustedYear = year;
  let adjustedMonth = month;

  if (adjustedMonth <= 2) {
    adjustedYear -= 1;
    adjustedMonth += 12;
  }

  const jd =
    Math.floor(365.25 * (adjustedYear + 4716)) +
    Math.floor(30.6001 * (adjustedMonth + 1)) +
    2 -
    Math.floor(adjustedYear / 100) +
    Math.floor(Math.floor(adjustedYear / 100) / 4) +
    day -
    1524.5 +
    (hour + min / 60 + sec / 3600) / 24;

  return jd;
}

export function convertUTCToAzEl(
  UTC: string,
  Lat: number,
  Lon: number,
  RA: number,
  Dec: number
): { Az: number; El: number } {
  // Convert UTC to Julian Date
  const jd = juliandate(UTC);
  const d = jd - 2451543.5;

  // Keplerian Elements for the Sun (geocentric)
  const w = 282.9404 + 4.70935e-5 * d; // Longitude of perihelion in degrees
  const M = (356.047 + 0.9856002585 * d) % 360; // Mean anomaly in degrees
  const L = w + M; // Sun's mean longitude in degrees

  // Find the J2000 value
  // const Jtwo = jd - 2451545.0;

  // Extract the UTC time values
  const hourvec = UTC.split(/[- :]/).map(Number);
  const UTH = hourvec[3] + hourvec[4] / 60 + hourvec[5] / 3600;

  // Calculate local sidereal time
  const GMST0 = ((L + 180) % 360) / 15;
  const SIDTIME = GMST0 + UTH + Lon / 15;

  // Replace RA with hour angle HA
  const HA = SIDTIME * 15 - RA;

  // Convert to rectangular coordinate system
  const x = Math.cos(HA * (Math.PI / 180)) * Math.cos(Dec * (Math.PI / 180));
  const y = Math.sin(HA * (Math.PI / 180)) * Math.cos(Dec * (Math.PI / 180));
  const z = Math.sin(Dec * (Math.PI / 180));

  // Rotate this along an axis going east-west.
  const xhor =
    x * Math.cos((90 - Lat) * (Math.PI / 180)) -
    z * Math.sin((90 - Lat) * (Math.PI / 180));
  const yhor = y;
  const zhor =
    x * Math.sin((90 - Lat) * (Math.PI / 180)) +
    z * Math.cos((90 - Lat) * (Math.PI / 180));

  // Find the Azimuth and Elevation
  const Az = Math.atan2(yhor, xhor) * (180 / Math.PI) + 180;
  const El = Math.asin(zhor) * (180 / Math.PI);

  return { Az, El };
}

// Example usage
const UTC = "2025/03/01 12:00:00"; // Example UTC time
const Lat = 40.7128; // Example Latitude (New York City)
const Lon = -74.006; // Example Longitude (New York City)
const RA = 10; // Example Right Ascension in degrees
const Dec = 20; // Example Declination in degrees

const result = convertUTCToAzEl(UTC, Lat, Lon, RA, Dec);
console.log(result); // Output: { Az: Azimuth, El: Elevation }

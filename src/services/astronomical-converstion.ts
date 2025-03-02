export const RADecAzEl = (
  RA: number,
  Dec: number,
  UTC: number[],
  Lat: number,
  Lon: number
): { azimuth: number; altitude: number } => {
  const jd = new Date().getTime() / 86400000 + 2440587.5;
  const d = jd - 2451543.5;

  const w = 282.9404 + 4.70935e-5 * d;
  const M = (356.047 + 0.9856002585 * d) % 360; //mod(356.0470+0.9856002585*d,360);
  const L = w + M;

  // const J2000 = jd - 2451545.0;

  const UTH = UTC[3] + UTC[4] / 60 + UTC[5] / 3600;

  const GMST0 = (L + (180 % 360)) / 15; //mod(L+180,360)/15;
  const SIDTIME = GMST0 + UTH + Lon / 15;

  const HA = SIDTIME * 15 - RA;

  const x = Math.cos(HA * (Math.PI / 180)) * Math.cos(Dec * (Math.PI / 180));
  const y = Math.sin(HA * (Math.PI / 180)) * Math.cos(Dec * (Math.PI / 180));
  const z = Math.sin(Dec * (Math.PI / 180));

  const xhor =
    x * Math.cos((90 - Lat) * (Math.PI / 180)) -
    z * Math.sin((90 - Lat) * (Math.PI / 180));
  const yhor = y;
  const zhor =
    x * Math.sin((90 - Lat) * (Math.PI / 180)) +
    z * Math.cos((90 - Lat) * (Math.PI / 180));

  const Az = Math.atan2(yhor, xhor) * (180 / Math.PI) + 180;
  const El = Math.asin(zhor) * (180 / Math.PI);

  return { azimuth: Az, altitude: El };
};

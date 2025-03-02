import { CelestialBody } from "../types/celestial-body";
import Papa from "papaparse";

const RADecAzEl = (
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

const getTime = (): number[] => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDay();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  return [year, month, day, hour, minute, second];
};

export const getExoplanets = async (params: {
  onError?: (error: string) => void;
}): Promise<CelestialBody[]> => {
  const dataSource = "/cleaned_exoplanet_data.csv";

  return new Promise((resolve, reject) => {
    Papa.parse(dataSource, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (results) {
        const csvData = results.data as [];
        const csvErrors = results.errors;

        if (csvData) {
          const UTC = getTime();
          const longitude = -96.69649194582368;
          const latitude = 40.82121710878628;

          console.log(csvData);

          const celestialBodies: CelestialBody[] = csvData.map((row) => {
            const RA = row["right_ascension"];
            const Dec = row["declination"];
            const polar = RADecAzEl(RA, Dec, UTC, latitude, longitude);
            const mass = row["mass"];
            const radius = row["radius"];
            const distance = row["distance"];

            return {
              name: row["name"],
              azimuth: polar.azimuth,
              polarAngle: polar.altitude,
              kind: "exo-planet",
              mass,
              radius,
              distance,
            };
          });
          resolve(celestialBodies);
        } else if (csvErrors.length > 0) {
          if (params.onError) {
            params.onError(
              `Failed to parse exoplanets from CSV: ${csvErrors.toString()}`
            );
          }
          reject(csvErrors);
        } else {
          if (params.onError) {
            params.onError(
              "Failed to parse exoplanets from CSV: An unknown error occurred"
            );
          }
          reject(new Error("Unknown error parsing CSV"));
        }
      },
    });
  });
};

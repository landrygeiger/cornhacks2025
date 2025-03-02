export type CelestialBody = {
  name: string;
  azimuth: number;
  polarAngle: number;
};

export const filterOnView = (
  bodies: CelestialBody[],
  viewAzimuth: number,
  viewPolarAngle: number,
  coneAngle: number
): CelestialBody[] => {
  return bodies.filter((body) => {
    const azimuthDiff = Math.abs(body.azimuth - viewAzimuth);
    const polarDiff = Math.abs(body.polarAngle - viewPolarAngle);

    return azimuthDiff <= coneAngle && polarDiff <= coneAngle;
  });
};

export const celestialBodyToText = (bodies: CelestialBody[]): string[] => {
  const text = bodies.map((body) => {
    return body.name;
  });
  return text;
};

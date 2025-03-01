export type CelestialBody = {
  name: string;
  azimuth: number;
  polarAngle: number;
};

export function filterOnView(
  bodies: CelestialBody[],
  viewAzimuth: number,
  viewPolarAngle: number,
  coneAngle: number
): CelestialBody[] {
  return bodies.filter((body) => {
    const azimuthDiff = Math.abs(body.azimuth - viewAzimuth);
    const polarDiff = Math.abs(body.polarAngle - viewPolarAngle);

    return azimuthDiff <= coneAngle && polarDiff <= coneAngle;
  });
}

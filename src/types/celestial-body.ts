import {
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
} from "three";

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

export const addToScene = (celestialBody: CelestialBody, scene: Scene) => {
  const geometry = new SphereGeometry(1);
  const material = new MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new Mesh(geometry, material);

  const phi = MathUtils.degToRad(90 - celestialBody.polarAngle);
  const theta = MathUtils.degToRad(celestialBody.azimuth);
  sphere.position.setFromSphericalCoords(10, phi, theta);
  scene.add(sphere);
};

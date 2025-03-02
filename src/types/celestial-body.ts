import {
  CanvasTexture,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
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

  const textCanvas = document.createElement("canvas");
  const ctx = textCanvas.getContext("2d");
  if (!ctx) return;
  textCanvas.width = 256;
  textCanvas.height = 128;

  // Draw text on the canvas
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(celestialBody.name, textCanvas.width / 2, textCanvas.height / 2);

  // Create texture from canvas
  const textTexture = new CanvasTexture(textCanvas);
  const textMaterial = new SpriteMaterial({ map: textTexture });

  // Create sprite for text
  const textSprite = new Sprite(textMaterial);
  textSprite.scale.set(2, 1, 1); // Adjust size
  textSprite.position.setFromSphericalCoords(8, phi, theta); // Position in front of sphere
  scene.add(textSprite);
};

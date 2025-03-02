import {
  CanvasTexture,
  DirectionalLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
} from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { match } from "ts-pattern";

export type CelestialBody = {
  name: string;
  azimuth: number;
  polarAngle: number;
} & (
  | {
      kind: "exo-planet";
      mass: number;
      radius: number;
      distance: number;
    }
  | {
      kind: "solar-system";
    }
);

export const filterOnView = (
  bodies: CelestialBody[],
  viewAzimuth: number,
  viewPolarAngle: number,
  coneAngle: number,
): CelestialBody[] => {
  return bodies.filter((body) => {
    const azimuthDiff = Math.abs(body.azimuth - viewAzimuth);
    const polarDiff = Math.abs(body.polarAngle - viewPolarAngle);

    return azimuthDiff <= coneAngle && polarDiff <= coneAngle;
  });
};

const modelSizes: Record<string, number> = {
  Mercury: 4,
  Venus: 0.018,
  Mars: 4,
  Jupiter: 0.02,
  Saturn: 3,
  Uranus: 2,
  Neptune: 2.1,
  Sun: 2.4,
  Moon: 0.03,
  Pluto: 6,
};

const getSphereRadius = (celestialBody: CelestialBody) =>
  match(celestialBody)
    .with({ kind: "solar-system" }, () => 1)
    .with({ kind: "exo-planet" }, (exoPlanet) => (0.2 * exoPlanet.radius) / 2)
    .exhaustive();

const getSphereColor = (celestialBody: CelestialBody) =>
  match(celestialBody.kind)
    .with("solar-system", () => 0xffa500)
    .with("exo-planet", () => 0x808080)
    .exhaustive();

export const addToScene = (celestialBody: CelestialBody, scene: Scene) => {
  const phi = MathUtils.degToRad(90 - celestialBody.polarAngle);
  const theta = MathUtils.degToRad(celestialBody.azimuth);
  if (celestialBody.kind === "solar-system") {
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    const loader = new GLTFLoader();

    loader.load(
      `/models/${celestialBody.name}.glb`,
      (gltf) => {
        const model = gltf.scene;
        const modelSize = modelSizes[celestialBody.name];
        model.scale.set(modelSize, modelSize, modelSize); // Adjust scale if needed
        model.position.setFromSphericalCoords(10, phi, theta);
        scene.add(model);
      },
      undefined,
      (error) =>
        console.error(`Error loading model for ${celestialBody.name}:`, error),
    );
  } else {
    const geometry = new SphereGeometry(getSphereRadius(celestialBody));
    const material = new MeshBasicMaterial({
      color: getSphereColor(celestialBody),
    });
    const sphere = new Mesh(geometry, material);
    sphere.position.setFromSphericalCoords(10, phi, theta);
    scene.add(sphere);
  }
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

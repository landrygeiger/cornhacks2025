import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import * as CelestialBody from "../types/celestial-body";
import { addKeyboardCameraControls } from "../utils/orientation";
import { clearScene, initializeScene } from "../utils/render";
import Camera from "./Camera";
import { AmbientLight } from "three";

type Props = {
  /**
   * In rem. Defaults to 100% width.
   */
  width?: number;
  /**
   * In rem. Defaults to 100% height.
   */
  height?: number;
  celestialBodies: CelestialBody.CelestialBody[];
  highlightedBodies?: CelestialBody.CelestialBody[];
  enableKeyboardNav?: boolean;
};

const CelestialBodyViewer: FC<Props> = ({
  width,
  height,
  celestialBodies,
  highlightedBodies = [],
  enableKeyboardNav,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      document.documentElement.clientWidth /
        document.documentElement.clientHeight,
      0.1,
      1000
    )
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ alpha: true }));

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    clearScene(scene);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";

    const ambientLight = new AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    containerRef.current.appendChild(renderer.domElement);

    celestialBodies.forEach((celestialBody) => {
      CelestialBody.addToScene(celestialBody, scene, highlightedBodies);
    });

    return initializeScene(width, height, scene, camera, renderer);
  }, [celestialBodies, highlightedBodies]);

  useEffect(() => {
    if (enableKeyboardNav) {
      return addKeyboardCameraControls(cameraRef.current);
    }
  }, [enableKeyboardNav]);

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
        position: "relative",
      }}
      ref={containerRef}
    >
      <Camera />
    </div>
  );
};

export default CelestialBodyViewer;

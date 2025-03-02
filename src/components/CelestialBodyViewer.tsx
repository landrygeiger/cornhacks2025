import { FC, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { DeviceOrientationControls } from "../utils/DeviceOrientationControls";
import { isMobile } from "../utils/orientation";
import Camera from "./Camera";
import * as CelestialBody from "../types/celestial-body";

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
};

const CelestialBodyViewer: FC<Props> = ({ width, height, celestialBodies }) => {
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

  const initializeScene = useCallback(() => {
    rendererRef.current.domElement.style.position = "absolute";
    rendererRef.current.domElement.style.top = "0";
    if (containerRef.current) {
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      containerRef.current.appendChild(rendererRef.current.domElement);
    }

    celestialBodies.forEach((celestialBody) =>
      CelestialBody.addToScene(celestialBody, sceneRef.current)
    );

    const controls = isMobile()
      ? new DeviceOrientationControls(cameraRef.current)
      : undefined;

    const animate = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (controls) (controls as any).update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    rendererRef.current.setAnimationLoop(animate);

    const onWindowResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    addEventListener("resize", onWindowResize);

    return () => {
      removeEventListener("resize", onWindowResize);
    };
  }, [celestialBodies]);

  useEffect(() => {
    addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          cameraRef.current.rotation.x += 0.25;
          break;
        case "s":
          cameraRef.current.rotation.x -= 0.25;
          break;
        case "d":
          cameraRef.current.rotation.y -= 0.25;
          break;
        case "a":
          cameraRef.current.rotation.y += 0.25;
          break;
      }
    });
    return initializeScene();
  });

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

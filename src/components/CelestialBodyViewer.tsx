import { FC, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { CelestialBody } from "../types/celestial-body";
import { DeviceOrientationControls } from "../utils/DeviceOrientationControls";
import { isMobile } from "../utils/orientation";
import Camera from "./Camera";

type Props = {
  /**
   * In rem. Defaults to 100% width.
   */
  width?: number;
  /**
   * In rem. Defaults to 100% height.
   */
  height?: number;
  // facingMode?: string;
  celestialBodies: CelestialBody[];
};

const CelestialBodyViewer: FC<Props> = ({ width, height }) => {
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
    rendererRef.current.setSize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight
    );
    rendererRef.current.domElement.style.position = "absolute";
    rendererRef.current.domElement.style.top = "0";
    if (containerRef.current) {
      containerRef.current.appendChild(rendererRef.current.domElement);
    }

    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, -10);
    sceneRef.current.add(sphere);

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
      const newWidth = document.documentElement.clientWidth;
      const newHeight = document.documentElement.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    addEventListener("resize", onWindowResize);

    return () => {
      removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    return initializeScene();
    // addEventListener("keydown", (e) => {
    //   switch (e.key) {
    //     case "w":
    //       cameraRef.current.rotation.x += 0.25;
    //       break;
    //     case "s":
    //       cameraRef.current.rotation.x -= 0.25;
    //       break;
    //     case "d":
    //       cameraRef.current.rotation.y -= 0.25;
    //       break;
    //     case "a":
    //       cameraRef.current.rotation.y += 0.25;
    //       break;
    //   }
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

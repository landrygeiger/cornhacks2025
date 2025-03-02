import { FC, useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    if (containerRef.current)
      containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, -10);
    scene.add(sphere);

    const controls = isMobile()
      ? new DeviceOrientationControls(camera)
      : undefined;

    const animate = () => {
      if (controls) (controls as any).update();
      renderer.render(scene, camera);
    };

    addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          camera.rotation.x += 0.25;
          break;
        case "s":
          camera.rotation.x -= 0.25;
          break;
        case "d":
          camera.rotation.y -= 0.25;
          break;
        case "a":
          camera.rotation.y += 0.25;
          break;
      }
    });

    renderer.setAnimationLoop(animate);
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

import { FC, useState } from "react";
import * as THREE from "three";
import { CelestialBody } from "../types/celestial-body";
import { DeviceOrientationControls } from "../utils/DeviceOrientationControls";
// import Camera from "./Camera";

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
  // useEffect(() => {
  //   return () => {
  //     window.removeEventListener("deviceorientation";
  //   };
  // }, []);

  const [agb] = useState({
    b: 0,
    g: 0,
    a: 0,
  });

  const handleClick = async () => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "10";
    document.body.appendChild(renderer.domElement);

    // Create a sphere
    const geometry = new THREE.SphereGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(10, 0, 0);
    scene.add(sphere);

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      await (DeviceOrientationEvent as any).requestPermission();
    }

    const controls = new DeviceOrientationControls(camera);

    // Camera position
    camera.position.z = 10;

    function animate() {
      if (controls) (controls as any).update();
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    // const handleMotion = (event: DeviceOrientationEvent) => {
    //   const { alpha, beta, gamma } = event;
    //   if (alpha !== null && beta !== null && gamma !== null) {
    //     const radAlpha = THREE.MathUtils.degToRad(alpha);
    //     const radBeta = THREE.MathUtils.degToRad(beta);
    //     const radGamma = THREE.MathUtils.degToRad(gamma);

    //     const euler = new THREE.Euler(radBeta, radGamma, radAlpha, "YXZ");
    //     const quaternion = new THREE.Quaternion();
    //     quaternion.setFromEuler(euler);
    //     camera.setRotationFromQuaternion(quaternion);

    //     setAgb({ b: beta, g: gamma, a: alpha });
    //   }
    // };
  };

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
      }}
    >
      <p id="egg">yoyoyo</p>
      <button onClick={handleClick} className="">
        Click me
      </button>
      <p>{`b: ${agb.b.toFixed(2)}, g: ${agb.g.toFixed(2)}, a: ${agb.a.toFixed(
        2
      )}`}</p>
      {/* <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      /> */}
    </div>
  );
};

export default CelestialBodyViewer;

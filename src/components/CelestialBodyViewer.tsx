import { FC, useState } from "react";
import * as THREE from "three";
import { CelestialBody } from "../types/celestial-body";

type Props = {
  /**
   * In rem. Defaults to 100% width.
   */
  width?: number;
  /**
   * In rem. Defaults to 100% height.
   */
  height?: number;
  facingMode?: string;
  celestialBodies: CelestialBody[];
};

const CelestialBodyViewer: FC<Props> = ({ width, height, facingMode }) => {
  // useEffect(() => {
  //   return () => {
  //     window.removeEventListener("deviceorientation";
  //   };
  // }, []);

  const [agb, setAgb] = useState({
    b: 0,
    g: 0,
    a: 0,
  });

  const handleClick = () => {
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
    renderer.domElement.style.top = "5rem";
    document.body.appendChild(renderer.domElement);

    // Create a sphere
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Camera position
    camera.position.z = 10;

    function animate() {
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    const handleMotion = (event: DeviceOrientationEvent) => {
      const { alpha, beta, gamma } = event;
      if (alpha !== null && beta !== null && gamma !== null) {
        const radAlpha = THREE.MathUtils.degToRad(alpha);
        const radBeta = THREE.MathUtils.degToRad(beta);
        const radGamma = THREE.MathUtils.degToRad(gamma);

        setAgb({ b: beta, g: gamma, a: alpha });

        // Simple rotation based on device orientation
        camera.rotation.set(radBeta, radGamma, radAlpha);
      }
    };

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any).requestPermission().then(() => {
        window.addEventListener("deviceorientation", handleMotion);
      });
    }
  };

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
      }}
    >
      <button onClick={handleClick} className="">
        Click me
      </button>
      <p>{JSON.stringify(agb)}</p>
      {/* <Camera facingMode={facingMode} /> */}
      {/* <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      /> */}
    </div>
  );
};

export default CelestialBodyViewer;

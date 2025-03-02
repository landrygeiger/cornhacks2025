import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { DeviceOrientationControls } from "./DeviceOrientationControls";
import { isMobile } from "./orientation";
import * as THREE from "three";

export const setViewSize = (
  width: number,
  height: number,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
) => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export const initializeScene = (
  width: number,
  height: number,
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setQT: React.Dispatch<React.SetStateAction<THREE.Quaternion>>,
) => {
  setViewSize(width, height, camera, renderer);
  const controls = isMobile()
    ? new DeviceOrientationControls(camera)
    : undefined;

  const animate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (controls) (controls as any).update();
    // setQT(camera.quaternion.clone());
    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  const onWindowResize = () => {
    setViewSize(width, height, camera, renderer);
  };
  addEventListener("resize", onWindowResize);

  return () => {
    removeEventListener("resize", onWindowResize);
  };
};

export const clearScene = (scene: Scene) => {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
};

import { FC, useState } from "react";
import CelestialBodyViewer from "./CelestialBodyViewer";
import Landing from "./Landing";
import useCelestialBodies from "../hooks/useCelestialBodies";
import { filterOnView } from "../types/celestial-body";
import * as THREE from "three";

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { filteredCelestialBodies } = useCelestialBodies({
    onError: console.error,
  });
  const [cameraQt, setCameraQt] = useState(new THREE.Quaternion());
  const qtToPolar = (oldQt: THREE.Quaternion) => {
    const qt = oldQt.clone();
    qt.normalize();

    // Compute azimuth (yaw) using quaternion components
    const azimuth =
      (Math.atan2(
        2 * (qt.w * qt.y + qt.x * qt.z),
        1 - 2 * (qt.y * qt.y + qt.z * qt.z),
      ) *
        180) /
        Math.PI +
      180;

    // Compute altitude (pitch) using quaternion components
    const altitude =
      (Math.asin(2 * (qt.w * qt.x - qt.y * qt.z)) * 180) / Math.PI;

    return { azimuth, altitude };
  };

  const cameraPolar = qtToPolar(cameraQt);
  const onscreenCelestialBodies = filterOnView(
    filteredCelestialBodies ?? [],
    cameraPolar.azimuth,
    cameraPolar.altitude,
    45,
  );

  return isInitialized && filteredCelestialBodies ? (
    <CelestialBodyViewer
      celestialBodies={filteredCelestialBodies}
      enableKeyboardNav
      setQt={setCameraQt}
    />
  ) : (
    <Landing onAppInitialized={() => setIsInitialized(true)} />
  );
};

export default App;

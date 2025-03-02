import { FC, useState } from "react";
import CelestialBodyViewer from "./CelestialBodyViewer";
import Landing from "./Landing";
import useCelestialBodies from "../hooks/useCelestialBodies";
import ArrowToBody from "./ArrowToBody";
import { angleToBody } from "../utils/arrow-to-body";
import * as THREE from "three";

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { celestialBodies } = useCelestialBodies({ onError: console.error });
  const selectedBody = celestialBodies?.find((body) => body.name === "Mars");
  const [quaternion, setQuaternion] = useState<THREE.Quaternion>(
    new THREE.Quaternion()
  );

  const euler = new THREE.Euler();
  euler.setFromQuaternion(quaternion, "XYZ");

  const azimuth = (euler.y * 180) / Math.PI;
  const altitude = (euler.x * 180) / Math.PI;
  const roll = (euler.z * 180) / Math.PI;

  const calculatedDegrees = angleToBody(
    {
      azimuth: selectedBody?.azimuth ?? 0,
      altitude: selectedBody?.polarAngle ?? 0,
    },
    {
      azimuth: azimuth,
      altitude: altitude,
    },
    roll
  );

  return isInitialized && celestialBodies ? (
    <>
      <CelestialBodyViewer
        setQT={setQuaternion}
        celestialBodies={celestialBodies}
        enableKeyboardNav
      />
      <ArrowToBody angle={calculatedDegrees} />
    </>
  ) : (
    <Landing onAppInitialized={() => setIsInitialized(true)} />
  );
};

export default App;

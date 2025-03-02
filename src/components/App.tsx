import { FC, useState } from "react";
import CelestialBodyViewer from "./CelestialBodyViewer";
import Landing from "./Landing";
import useCelestialBodies from "../hooks/useCelestialBodies";

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { celestialBodies } = useCelestialBodies({ onError: console.error });

  return isInitialized && celestialBodies ? (
    <CelestialBodyViewer celestialBodies={celestialBodies} />
  ) : (
    <Landing onAppInitialized={() => setIsInitialized(true)} />
  );
};

export default App;

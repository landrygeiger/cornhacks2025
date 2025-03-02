import { FC, useState } from "react";
import CelestialBodyViewer from "./CelestialBodyViewer";
import Landing from "./Landing";
import useCelestialBodies from "../hooks/useCelestialBodies";

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { filteredCelestialBodies } = useCelestialBodies({
    onError: console.error,
  });

  return isInitialized && filteredCelestialBodies ? (
    <CelestialBodyViewer
      celestialBodies={filteredCelestialBodies}
      enableKeyboardNav
    />
  ) : (
    <Landing onAppInitialized={() => setIsInitialized(true)} />
  );
};

export default App;

import { FC, useState } from "react";
import CelestialBodyViewer from "./CelestialBodyViewer";
import Landing from "./Landing";

const App: FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  return isInitialized ? (
    <CelestialBodyViewer enableKeyboardNav />
  ) : (
    <Landing onAppInitialized={() => setIsInitialized(true)} />
  );
};

export default App;

import { FC, useEffect } from "react";
import { getAllGeoSpacialData } from "./services/AstronomyService";

const App: FC = () => {
  useEffect(() => {
    getAllGeoSpacialData();
  }, []);

  return <h1>Hello World</h1>;
};

export default App;

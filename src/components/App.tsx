import { FC, useEffect, useState } from "react";
import Camera from "./Camera";
import { getAllGeoSpacialData } from "../services/AstronomyService";
import { CelestialBody } from "../types/celestial-body";

const App: FC = () => {

  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);
  
  useEffect(()=>{
    getAllGeoSpacialData()
    .then((bodies: CelestialBody[])=>{
      setCelestialBodies(bodies);
    })
  }, [])
  return <>
  <p>{celestialBodies.map((body)=> body.name).toString()}</p><Camera />
    </>
;
};

export default App;

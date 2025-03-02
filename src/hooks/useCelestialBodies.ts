import { useCallback, useEffect, useState } from "react";
import { fetchSolarSystemData } from "../services/AstronomyService";
import { CelestialBody } from "../types/celestial-body";
import { getExoplanets } from "../services/astronomical-converstion";

type Params = {
  onError?: (error: string) => void;
};

const useCelestialBodies = ({ onError }: Params) => {
  const [celestialBodies, setCelestialBodies] = useState<
    CelestialBody[] | undefined
  >(undefined);

  const fetchCelestialBodies = useCallback(async () => {
    const solarSystem = await fetchSolarSystemData({ onError });
    const exoPlanets = await getExoplanets({ onError });
    setCelestialBodies([...solarSystem, ...exoPlanets]);
  }, [onError]);

  useEffect(() => {
    fetchCelestialBodies();
  }, [fetchCelestialBodies]);

  return { celestialBodies, fetchCelestialBodies };
};

export default useCelestialBodies;

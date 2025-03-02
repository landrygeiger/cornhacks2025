import { useCallback, useEffect, useState } from "react";
import { fetchSolarSystemData } from "../services/AstronomyService";
import { CelestialBody } from "../types/celestial-body";
import { getExoplanets } from "../services/astronomical-converstion";

type Params = {
  onError?: (error: string) => void;
};

export type CelestialBodyFilterConfig = {
  minMass: number;
  maxMass: number;
  minDistance: number;
  maxDistance: number;
  minRadius: number;
  maxRadius: number;
  showExoPlanets: boolean;
  showSolarSystem: boolean;
};
export type FilterForm = {
  minMass: string;
  maxMass: string;
  minDistance: string;
  maxDistance: string;
  minRadius: string;
  maxRadius: string;
  showExoPlanets: true;
  showSolarSystem: true;
};

const defaultFilterForm: FilterForm = {
  minMass: "0",
  maxMass: "100",
  minDistance: "0",
  maxDistance: "10000",
  minRadius: "0",
  maxRadius: "10",
  showExoPlanets: true,
  showSolarSystem: true,
};

export const defaultFilterConfig: CelestialBodyFilterConfig = {
  minMass: 0,
  maxMass: 100,
  minDistance: 0,
  maxDistance: 10000,
  minRadius: 0,
  maxRadius: 10,
  showExoPlanets: true,
  showSolarSystem: true,
};

const filterCelestialBodies = (
  celestialBodies: CelestialBody[],
  config: CelestialBodyFilterConfig
) =>
  celestialBodies
    .filter(
      (cb) =>
        cb.kind === "solar-system" ||
        (cb.mass >= config.minMass && cb.mass <= config.maxMass)
    )
    .filter(
      (cb) =>
        cb.kind === "solar-system" ||
        (cb.radius >= config.minRadius && cb.radius <= config.maxRadius)
    )
    .filter(
      (cb) =>
        cb.kind === "solar-system" ||
        (cb.distance >= config.minDistance && cb.distance <= config.maxDistance)
    )
    .filter(
      (cb) =>
        cb.kind === "solar-system" ||
        (cb.kind === "exo-planet" && config.showExoPlanets)
    )
    .filter(
      (cb) =>
        cb.kind === "exo-planet" ||
        (cb.kind === "solar-system" && config.showSolarSystem)
    );

const useCelestialBodies = ({ onError }: Params) => {
  const [celestialBodies, setCelestialBodies] = useState<CelestialBody[]>([]);

  const [filterForm, setFilterForm] = useState<FilterForm>(defaultFilterForm);

  const [filterConfig, setFilterConfig] =
    useState<CelestialBodyFilterConfig>(defaultFilterConfig);

  const filteredCelestialBodies = filterCelestialBodies(
    celestialBodies ?? [],
    filterConfig
  );
  console.log("inside hook", filteredCelestialBodies.length);
  // const updateFilterConfig = updateProperty(setFilterConfig);

  const fetchCelestialBodies = useCallback(async () => {
    const solarSystem = await fetchSolarSystemData({ onError });
    const exoPlanets = await getExoplanets({ onError });
    setCelestialBodies([...solarSystem, ...exoPlanets]);
  }, [onError]);

  useEffect(() => {
    fetchCelestialBodies();
  }, [fetchCelestialBodies]);

  return {
    celestialBodies,
    filteredCelestialBodies,
    filterConfig,
    // updateFilterConfig,
    setFilterConfig,
    fetchCelestialBodies,
    filterForm,
    setFilterForm,
  };
};

export default useCelestialBodies;

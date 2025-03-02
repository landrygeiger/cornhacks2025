import { useCallback, useEffect, useState } from "react";
import { fetchSolarSystemData } from "../services/AstronomyService";
import { CelestialBody } from "../types/celestial-body";
import { getExoplanets } from "../services/astronomical-converstion";
import { updateProperty } from "../utils/pure";

type Params = {
  onError?: (error: string) => void;
};

export type FilterConfig = {
  minMass: number;
  maxMass: number;
  minDistance: number;
  maxDistance: number;
  minRadius: number;
  maxRadius: number;
  showExoPlanets: boolean;
  showSolarSystem: boolean;
};

const defaultFilterConfig: FilterConfig = {
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
  config: FilterConfig
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
  const [celestialBodies, setCelestialBodies] = useState<
    CelestialBody[] | undefined
  >(undefined);
  const [filteredCelestialBodies, setFilteredCelestialBodies] = useState<
    CelestialBody[] | undefined
  >(undefined);

  const [filterConfig, setFilterConfig] =
    useState<FilterConfig>(defaultFilterConfig);

  const updateFilterConfig = updateProperty(setFilterConfig);

  const fetchCelestialBodies = useCallback(async () => {
    const solarSystem = await fetchSolarSystemData({ onError });
    const exoPlanets = await getExoplanets({ onError });
    setCelestialBodies([...solarSystem, ...exoPlanets]);
  }, [onError]);

  useEffect(() => {
    fetchCelestialBodies();
  }, [fetchCelestialBodies]);

  useEffect(
    () =>
      celestialBodies
        ? setFilteredCelestialBodies(
            filterCelestialBodies(celestialBodies, filterConfig)
          )
        : undefined,
    [celestialBodies, filterConfig]
  );

  return {
    celestialBodies,
    filteredCelestialBodies,
    filterConfig,
    updateFilterConfig,
    fetchCelestialBodies,
  };
};

export default useCelestialBodies;

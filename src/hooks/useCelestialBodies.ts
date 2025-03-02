import { useCallback, useEffect, useState } from "react";
import { fetchSolarSystemData } from "../services/AstronomyService";
import { CelestialBody, filterOnView } from "../types/celestial-body";
import { getExoplanets } from "../services/astronomical-converstion";
import * as THREE from "three";

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
  showExoPlanets: boolean;
  showSolarSystem: boolean;
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
  const [highlightedBodies, setHighlightedBodies] = useState<CelestialBody[]>(
    []
  );

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

  const [cameraQT, setCameraQT] = useState(new THREE.Quaternion());

  const qtToPolar = (oldQt: THREE.Quaternion) => {
    const qt = oldQt.clone();
    qt.normalize();

    // Compute azimuth (yaw) using quaternion components
    const azimuth =
      (Math.atan2(
        2 * (qt.w * qt.y + qt.x * qt.z),
        1 - 2 * (qt.y * qt.y + qt.z * qt.z)
      ) *
        180) /
        Math.PI +
      180;

    // Compute altitude (pitch) using quaternion components
    const altitude =
      (Math.asin(2 * (qt.w * qt.x - qt.y * qt.z)) * 180) / Math.PI;

    return { azimuth, altitude };
  };

  const cameraPolar = qtToPolar(cameraQT);
  const onscreenCelestialBodies = filterOnView(
    filteredCelestialBodies,
    cameraPolar.azimuth,
    cameraPolar.altitude,
    45
  );

  return {
    celestialBodies,
    highlightedBodies,
    setHighlightedBodies,
    filteredCelestialBodies,
    filterConfig,
    // updateFilterConfig,
    setFilterConfig,
    fetchCelestialBodies,
    filterForm,
    setFilterForm,
    setCameraQT,
    onscreenCelestialBodies,
  };
};

export default useCelestialBodies;

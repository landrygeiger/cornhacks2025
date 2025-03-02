import { FC, useEffect, useRef } from "react";
import * as THREE from "three";
import { AmbientLight } from "three";
import useCelestialBodies from "../hooks/useCelestialBodies";
import * as CelestialBody from "../types/celestial-body";
import { addKeyboardCameraControls } from "../utils/orientation";
import { clearScene, initializeScene } from "../utils/render";
import AudioBar from "./AudioBar";
import Camera from "./Camera";
import CelestialBodyFilterMenu from "./CelestialBodyFilterMenu";

type Props = {
  /**
   * In rem. Defaults to 100% width.
   */
  width?: number;
  /**
   * In rem. Defaults to 100% height.
   */
  height?: number;
  enableKeyboardNav?: boolean;
};

const CelestialBodyViewer: FC<Props> = ({
  width,
  height,
  enableKeyboardNav,
}) => {
  const {
    filteredCelestialBodies,
    filterForm,
    setFilterConfig,
    setFilterForm,
    highlightedBodies,
    setHighlightedBodies,
    filterConfig,
    setCameraQT,
    celestialBodies,
  } = useCelestialBodies({
    onError: console.error,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      document.documentElement.clientWidth /
        document.documentElement.clientHeight,
      0.1,
      1000,
    ),
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ alpha: true }));

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    clearScene(scene);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";

    const ambientLight = new AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    containerRef.current.appendChild(renderer.domElement);

    filteredCelestialBodies.forEach((celestialBody) =>
      CelestialBody.addToScene(celestialBody, scene, highlightedBodies),
    );
    console.log(filteredCelestialBodies.length);

    // return initializeScene(width, height, scene, camera, renderer, setCameraQT);
    return initializeScene(width, height, scene, camera, renderer);
  }, [filteredCelestialBodies, highlightedBodies, setCameraQT]);

  useEffect(() => {
    if (enableKeyboardNav) {
      return addKeyboardCameraControls(cameraRef.current);
    }
  }, [enableKeyboardNav]);

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
        position: "relative",
      }}
      ref={containerRef}
    >
      <Camera />
      <AudioBar
        setHighlighted={setHighlightedBodies}
        setConfigFile={setFilterConfig}
        configFile={filterConfig}
        celestialBodies={celestialBodies}
      />
      <CelestialBodyFilterMenu
        setFilterConfig={setFilterConfig}
        setFilterForm={setFilterForm}
        filterForm={filterForm}
      />
    </div>
  );
};

export default CelestialBodyViewer;

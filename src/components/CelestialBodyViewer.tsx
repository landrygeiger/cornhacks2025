import { FC, useEffect, useRef, useState } from "react";
import Camera from "./Camera";
import { CelestialBody } from "../types/celestial-body";

type Props = {
  /**
   * In rem. Defaults to 100% width.
   */
  width?: number;
  /**
   * In rem. Defaults to 100% height.
   */
  height?: number;
  facingMode?: string;
  celestialBodies: CelestialBody[];
};

const CelestialBodyViewer: FC<Props> = ({ width, height, facingMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const positionRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [debug, setDebug] = useState({
    px: -1,
    py: -1,
    vx: -1,
    vy: -1,
    a: -1,
    g: -1,
  });

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const updateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(positionRef.current.x, positionRef.current.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
    };

    const handleMotion = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (!gamma || !beta) {
        setDebug({ ...debug, a: -2, g: -2 });
        return;
      }
      velocityRef.current.x += gamma * 0.05;
      velocityRef.current.y += beta * 0.05;
      positionRef.current.x += velocityRef.current.x;
      positionRef.current.y += velocityRef.current.y;

      positionRef.current.x = Math.max(
        0,
        Math.min(window.innerWidth, positionRef.current.x)
      );
      positionRef.current.y = Math.max(
        0,
        Math.min(window.innerHeight, positionRef.current.y)
      );

      setDebug({
        px: positionRef.current.x,
        py: positionRef.current.y,
        vx: velocityRef.current.x,
        vy: velocityRef.current.y,
      });

      updateCanvas();
    };

    window.addEventListener("deviceorientation", handleMotion);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateCanvas();

    return () => {
      window.removeEventListener("deviceorientation", handleMotion);
    };
  }, []);

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
      }}
    >
      <p>{JSON.stringify(debug)}</p>
      <Camera facingMode={facingMode} />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default CelestialBodyViewer;

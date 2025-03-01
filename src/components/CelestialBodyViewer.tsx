import { FC, useRef, useState } from "react";
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
  const [error, setError] = useState("");

  const [times, setTimes] = useState(0);

  // useEffect(() => {
  //   return () => {
  //     window.removeEventListener("deviceorientation";
  //   };
  // }, []);

  const handleClick = () => {
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
      setTimes((time) => time + 1);
      const { beta, gamma } = event;
      if (!gamma || !beta) {
        setDebug({ ...debug, a: -2, g: -2 });
        return;
      }
      setDebug({
        px: positionRef.current.x,
        py: positionRef.current.y,
        vx: velocityRef.current.x,
        vy: velocityRef.current.y,
        a: beta,
        g: gamma,
      });
      const radBeta = (beta * Math.PI) / 180;
      const radGamma = (gamma * Math.PI) / 180;

      // Compute position changes based on tilt
      const deltaX = Math.sin(radGamma) * 5; // Left/right tilt
      const deltaY = Math.sin(radBeta) * 5; // Forward/backward tilt

      // Apply decay factor for smoother motion
      velocityRef.current.x *= 0.9;
      velocityRef.current.y *= 0.9;

      velocityRef.current.x += deltaX;
      velocityRef.current.y += deltaY;

      positionRef.current.x += velocityRef.current.x;
      positionRef.current.y += velocityRef.current.y;

      // Clamp to screen bounds
      positionRef.current.x = Math.max(
        0,
        Math.min(window.innerWidth, positionRef.current.x)
      );
      positionRef.current.y = Math.max(
        0,
        Math.min(window.innerHeight, positionRef.current.y)
      );

      updateCanvas();
    };

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then(() => {
          window.addEventListener("deviceorientation", handleMotion);
        })
        .catch((e: any) => setError(e.toString()));
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateCanvas();
  };

  return (
    <div
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
      }}
    >
      <button onClick={handleClick} className="">
        Click me
      </button>
      <p>{error} lol</p>
      <p>{times}</p>
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

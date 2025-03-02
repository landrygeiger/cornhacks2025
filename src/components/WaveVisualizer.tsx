import { FC, useEffect, useRef } from "react";
import { getFftFromStream } from "../utils/audio";
import { useResizeDetector } from "react-resize-detector";

type Props = {
  stream: MediaStream | null;
  color?: string;
  className?: string;
};

const WaveVisualizer: FC<Props> = ({ stream, color, className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ref: containerRef } = useResizeDetector({
    onResize: () => {
      if (!canvasRef.current) return;
      if (!containerRef.current) return;
      const WIDTH = containerRef.current.clientWidth;
      const HEIGHT = containerRef.current.clientHeight;
      canvasRef.current.width = WIDTH;
      canvasRef.current.height = HEIGHT;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color ?? "black";
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(5, HEIGHT / 2);
      ctx.lineTo(WIDTH - 5, HEIGHT / 2);
      ctx.stroke();
    },
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return console.error(
        "WaveVisualizer: Tried to draw to canvas ref before it had a value."
      );
    }
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) {
      return console.error("WaveVisualizer: Failed to get canvas context.");
    }
    if (!containerRef.current) return;

    const WIDTH = containerRef.current.clientWidth;
    const HEIGHT = containerRef.current.clientHeight;
    canvasRef.current.width = WIDTH;
    canvasRef.current.height = HEIGHT;

    if (!stream) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color ?? "black";
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(5, HEIGHT / 2);
      ctx.lineTo(WIDTH - 5, HEIGHT / 2);
      ctx.stroke();
      return;
    }

    const dataArray = new Uint8Array(512);
    const generateFft = getFftFromStream(stream, dataArray);
    let drawVisual: number;

    const draw = () => {
      const WIDTH = containerRef.current.clientWidth;
      const HEIGHT = containerRef.current.clientHeight;
      if (canvasRef.current) {
        canvasRef.current.width = WIDTH;
        canvasRef.current.height = HEIGHT;
      }
      drawVisual = requestAnimationFrame(draw);

      generateFft();

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color ?? "black";
      ctx.lineCap = "round";
      ctx.beginPath();

      const sliceWidth = (WIDTH * 1.0 - 10) / dataArray.length;
      let x = 5;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(WIDTH - 5, HEIGHT / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(drawVisual);
    };
  }, [color, containerRef, stream]);

  return (
    <div ref={containerRef} className={className}>
      <canvas
        style={{ imageRendering: "crisp-edges" }}
        ref={canvasRef}
        // width={containerRef.current?.clientWidth}
        // height={containerRef.current?.clientHeight}
      ></canvas>
    </div>
  );
};

export default WaveVisualizer;

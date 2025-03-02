import React from "react";

interface RayProps {
  angle: number; // Angle in degrees
}

const ArrowToBody: React.FC<RayProps> = ({ angle }) => {
  const pointA = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pointB = {
    x: pointA.x + 400 * Math.cos((angle * Math.PI) / 180),
    y: pointA.y + 400 * Math.sin((angle * Math.PI) / 180),
  };

  return (
    <div
      style={{
        position: "absolute",
        top: `${pointA.y}px`,
        left: `${pointA.x}px`,
        width:
          Math.sqrt(
            Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
          ) + "px",
        height: "2px",
        backgroundColor: "black",
        transformOrigin: "0 0",
        transform: `rotate(${
          Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * (180 / Math.PI)
        }deg)`,
        zIndex: 9999,
      }}
    />
  );
};

export default ArrowToBody;

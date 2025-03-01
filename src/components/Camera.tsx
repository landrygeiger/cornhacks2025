import { FC, useCallback, useEffect, useRef, useState } from "react";
import AudioBar from "./AudioBar";

const getUserVideoStream = async (
  facingMode: string,
  onError: (error: string) => void
) => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
      },
    });
  } catch (e) {
    onError(
      `Failed to initialize camera: ${
        e instanceof Error ? e.message : "An unknown error occurred."
      }`
    );
  }
};

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
  className?: string;
};

const Camera: FC<Props> = ({ width, height, facingMode, className }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState("");

  const initializeCamera = useCallback(async () => {
    const cameraStream = await getUserVideoStream(
      facingMode ?? "environment",
      setError
    );
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [facingMode]);

  useEffect(() => {
    initializeCamera();
  }, [initializeCamera]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: width ? `${width}rem` : "100%",
        height: height ? `${height}rem` : "100%",
      }}
    >
      {error ? (
        <p>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
      <AudioBar />
    </div>
  );
};

export default Camera;

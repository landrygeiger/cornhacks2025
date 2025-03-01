import { FC, useCallback, useEffect, useRef, useState } from "react";

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
  width: "full" | number;
  height: "full" | number;
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
    <div className={`relative w-${width} h-${height} ${className}`}>
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
    </div>
  );
};

export default Camera;

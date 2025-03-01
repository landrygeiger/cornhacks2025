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
  facingMode?: string;
};

const Camera: FC<Props> = ({ facingMode }) => {
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
  }, []);

  useEffect(() => {
    initializeCamera();
  }, [initializeCamera]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
          }}
        />
      )}
    </div>
  );
};

export default Camera;

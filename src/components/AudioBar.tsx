import { FC, useEffect, useRef, useState } from "react";

const onClick = async (
  isRecording: boolean, 
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>, 
  setError: React.Dispatch<React.SetStateAction<string>>,
  mediaRecorderRef: React.RefObject<MediaRecorder | null>,
  setPrompt: React.Dispatch<React.SetStateAction<string>>
) => {

  const recording = !isRecording;
  setIsRecording(recording);
  console.log(recording);

  if (recording) {
    beginRecording(setAudioStream, setError, mediaRecorderRef, setPrompt);
  } 
  else {
    haltRecording(setAudioStream, mediaRecorderRef);
  }
};

const beginRecording = async (
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  mediaRecorderRef: React.RefObject<MediaRecorder | null>,
  setPrompt: React.Dispatch<React.SetStateAction<string>>
) => {
  // turn on audio stream
  const stream = await getUserAudioStream(setError);
  setAudioStream(stream);

  if (stream) {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      console.log('Audio Blob:', audioBlob);

    };

    setPrompt("");
    mediaRecorder.start();
  }
};

const haltRecording = (
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
  mediaRecorderRef: React.RefObject<MediaRecorder | null>,
) => {
  const mediaRecorder = mediaRecorderRef.current;
  if (mediaRecorder) {
    // Stop recording
    mediaRecorder.stop();
  }
  setAudioStream(null);
};

const getUserAudioStream = async (
  onError: (error: string) => void
) => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true
    });
  } catch (e) {
    onError(
      `Failed to initialize audio: ${
        e instanceof Error ? e.message : "An unknown error occurred."
      }`
    );
    return null;
  }
};

const AudioBar: FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [prompt, setPrompt] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  return (
    <div>
      <button onClick={() => onClick(
        isRecording, 
        setIsRecording,
        setAudioStream, 
        setError,
        mediaRecorderRef,
        setPrompt
      )} className="">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {error && <p>{error}</p>}
      <p>{prompt}</p>
    </div>
  );
};

export default AudioBar;
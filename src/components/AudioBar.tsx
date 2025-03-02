import { FC, useEffect, useRef, useState } from "react";
import { transcribe } from "../services/transcription";
import { chat } from "../services/text-to-text";
import { textToSpeech } from "../services/text-to-speech";

const onClick = async (
  isRecording: boolean, 
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>, 
  setError: React.Dispatch<React.SetStateAction<string>>,
  mediaRecorderRef: React.RefObject<MediaRecorder | null>,
  setPrompt: React.Dispatch<React.SetStateAction<Blob>>
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
  setPrompt: React.Dispatch<React.SetStateAction<Blob>>
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

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/wav' });
      console.time();
      console.log("Speech To Text");
      const prompt = await transcribe(audioBlob);
      console.log("LLM");
      const textResp = await chat(prompt);
      console.log("Text to Speech");
      const speechResp = await textToSpeech(textResp);
      console.timeEnd();
      setPrompt(speechResp);


    };

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

const playAudioFromBlob = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();

  audio.onended = () => {
    URL.revokeObjectURL(url);
  };

  audio.onerror = () => {
    console.error("Error playing the audio");
    URL.revokeObjectURL(url);
  };
};


const AudioBar: FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [speechResponse, setSpeechResponse] = useState<Blob>(new Blob);
  const isMounted = useRef(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  useEffect(() => {
    if (isMounted.current) {
      playAudioFromBlob(speechResponse);
    } else {
      isMounted.current = true;
    }
  }, [speechResponse]);


  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <button onClick={() => onClick(
        isRecording, 
        setIsRecording,
        setAudioStream, 
        setError,
        mediaRecorderRef,
        setSpeechResponse
      )} className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 shadow-md ${
        isRecording
          ? "bg-[#A32222] hover:bg-[#8C1C1C] shadow-[#6E1616]"
          : "bg-[#C43D3D] hover:bg-[#A83232] shadow-[#872727]"
      }`}>
        {isRecording ? "Stop" : "Record"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AudioBar;
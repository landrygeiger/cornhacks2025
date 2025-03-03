import { FC, useEffect, useRef, useState } from "react";
import { transcribe } from "../services/transcription";
import {
  changeSettingsDecisionTree,
  chat,
  highlightSomePlanets,
  requestNewFilterConfig,
} from "../services/text-to-text";
import { textToSpeech } from "../services/text-to-speech";
import OpenAI from "openai";
import WaveVisualizer from "./WaveVisualizer";
import { CelestialBodyFilterConfig } from "../hooks/useCelestialBodies";
import { CelestialBody } from "../types/celestial-body";

type Props = {
  setHighlighted: React.Dispatch<React.SetStateAction<CelestialBody[]>>;
  setConfigFile: React.Dispatch<
    React.SetStateAction<CelestialBodyFilterConfig>
  >;
  configFile: CelestialBodyFilterConfig;
  celestialBodies: CelestialBody[];
};

const AudioBar: FC<Props> = ({
  setHighlighted,
  setConfigFile,
  configFile,
  celestialBodies,
}: Props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [speechResponse, setSpeechResponse] = useState<Blob>(new Blob());
  const [pastMessages, setPastMessages] = useState<
    OpenAI.Chat.Completions.ChatCompletionMessageParam[]
  >([]);
  const isMounted = useRef(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
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

  const beginRecording = async (
    setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    mediaRecorderRef: React.RefObject<MediaRecorder | null>,
    setPrompt: React.Dispatch<React.SetStateAction<Blob>>,
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
        const audioBlob = new Blob(chunks, { type: "audio/wav" });

        // transcribe user text
        const prompt = await transcribe(audioBlob);

        // determine the path for user text
        const decision = await changeSettingsDecisionTree(prompt);

        // if 1 use settings change endpoint
        if (decision === 1) {
          const res = await requestNewFilterConfig(prompt, configFile);
          setConfigFile(res);

          // if 2 use the highlight some planets and the chat endpoint
        } else if (decision == 2) {
          const res = await highlightSomePlanets(prompt, celestialBodies);
          console.log(res);
          setHighlighted(res);

          setPastMessages(
            pastMessages.slice(-4).concat(
              { role: "user", content: prompt },
              {
                role: "assistant",
                content: `highlighted planets: ${res.map((body) => body.name)}`,
              },
            ),
          );

          const textResp = await chat(prompt, pastMessages);
          const speechResp = await textToSpeech(textResp);

          setPastMessages(
            pastMessages
              .slice(-4)
              .concat(
                { role: "user", content: prompt },
                { role: "assistant", content: textResp },
              ),
          );

          setPrompt(speechResp);

          // if 3 use the chat endpoint
        } else {
          const textResp = await chat(prompt, pastMessages);
          const speechResp = await textToSpeech(textResp);

          setPastMessages(
            pastMessages
              .slice(-4)
              .concat(
                { role: "user", content: prompt },
                { role: "assistant", content: textResp },
              ),
          );

          setPrompt(speechResp);
        }
      };

      mediaRecorder.start(1000);
    }
  };

  const onClick = async (
    isRecording: boolean,
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
    setAudioStream: React.Dispatch<React.SetStateAction<MediaStream | null>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    mediaRecorderRef: React.RefObject<MediaRecorder | null>,
    setPrompt: React.Dispatch<React.SetStateAction<Blob>>,
  ) => {
    const recording = !isRecording;
    setIsRecording(recording);
    console.log(recording);

    if (recording) {
      beginRecording(setAudioStream, setError, mediaRecorderRef, setPrompt);
    } else {
      haltRecording(setAudioStream, mediaRecorderRef);
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

  const getUserAudioStream = async (onError: (error: string) => void) => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (e) {
      onError(
        `Failed to initialize audio: ${
          e instanceof Error ? e.message : "An unknown error occurred."
        }`,
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

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex bg-gray-800 py-2 px-4 rounded-2xl shadow-md shadow-gray-950`}
    >
      <WaveVisualizer
        stream={audioStream}
        className={`h-20 transition-all duration-300 ${
          isRecording ? "w-36" : "w-0"
        }`}
        color="white"
      />
      <button
        onClick={() =>
          onClick(
            isRecording,
            setIsRecording,
            setAudioStream,
            setError,
            mediaRecorderRef,
            setSpeechResponse,
          )
        }
        className={`self-center px-3 py-3 rounded-xl font-medium text-white transition-all duration-300 cursor-pointer bg-gray-100/10 hover:bg-gray-100/20`}
      >
        {isRecording ? "Stop" : "Speak"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AudioBar;

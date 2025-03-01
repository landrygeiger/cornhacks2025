import OpenAI from "openai";

export const textToSpeech = async (inputText: string): Promise<Blob> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const audio = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: inputText,
    response_format: "wav",
  });

  const audioData = new Blob([await audio.arrayBuffer()], {
    type: "audio/wav",
  });

  return audioData;
};

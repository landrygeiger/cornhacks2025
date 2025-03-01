import OpenAI from "openai";

export const textToSpeech = async (inputText: string): Promise<Blob> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

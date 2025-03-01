import OpenAI from "openai";

export const transcribe = async (userSpeech: Blob): Promise<string> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const speech = new File([userSpeech], "speech.wav", { type: "audio/wav" });

  const transcription = await openai.audio.transcriptions.create({
    file: speech,
    model: "whisper-1",
  });

  const content = transcription.text ? transcription.text : "Error";

  return content;
};

import OpenAI from "openai";

export const transcribe = async (userSpeech: Blob): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const speech = blobToFile(userSpeech, "speech.wav", "audio/wav");

  const transcription = await openai.audio.transcriptions.create({
    file: speech,
    model: "whisper-1",
  });

  const content = transcription.text ? transcription.text : "Error";

  return content;
};

const blobToFile = (data: Blob, fileName: string, mimeType: string) => {
  return new File([data], fileName, { type: mimeType });
};

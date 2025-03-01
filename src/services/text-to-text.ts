import OpenAI from "openai";

export const chat = async (userText: string): Promise<string> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [{ role: "user", content: userText }],
  });

  const content = completion.choices[0].message.content
    ? completion.choices[0].message.content
    : "Error";

  return content;
};

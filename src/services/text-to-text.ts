import OpenAI from "openai";
const systemPrompts: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{role: "system", content:"You are a AI Astronomy expert called Ad Astra. It is the year 3000. You have been tasked to be a trip planner for planets and exoplanets that users may want to visit. Keep your responses very concise but creative. If you do not have data about a specific exoplanet, pretend that you do. Responses should be under 20 words."}];
export const chat = async (userText: string, pastMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]): Promise<string> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: systemPrompts.concat(pastMessages.concat({ role: "user", content: userText })),
  });

  const content = completion.choices[0].message.content
    ? completion.choices[0].message.content
    : "Error";

  return content;
};

import OpenAI from "openai";
import { FilterConfig } from "../hooks/useCelestialBodies";
const systemPrompts: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{role: "system", content:"You are a AI Astronomy expert called Ad Astra. It is the year 3000. You have been tasked to be a trip planner for planets and exoplanets that users may want to visit. Keep your responses very concise but creative. If you do not have data about a specific exoplanet, pretend that you do. Responses should be under 20 words. If you recieve any commands about which planets show, labels, or highlighting planets, simply reply: 'Happy to help'."}];
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

export const requestNewFilterConfig = async (
  userText: string,
  currentFilterConfig: FilterConfig
): Promise<FilterConfig> => {
  const filterConfigSystemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a planet visualization tool. Given the user's message, determine if any changes need to be made to the following Filter Config: ${JSON.stringify(
        currentFilterConfig
      )} For example, if they request exo-planets to be hidden, you should return the Filter Config in the same valid JSON syntax with 'showExoPlanets' set to 'false'. If the user does not request changes, return the same object unchanged. Ensure your response is only a valid JSON object.`,
    },
  ];

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  let attempts = 0;
  while (attempts < 5) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: systemPrompts.concat(
          filterConfigSystemPrompt.concat({ role: "user", content: userText })
        ),
      });

      const content = completion.choices[0].message.content || "Error";

      const newFilterConfig: FilterConfig = JSON.parse(content);
      return newFilterConfig;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }
  console.warn("Returning default filter config after 5 failed attempts.");
  return currentFilterConfig; // Return the original config if all attempts fail
};

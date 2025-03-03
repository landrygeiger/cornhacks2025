import OpenAI from "openai";
import { CelestialBodyFilterConfig } from "../hooks/useCelestialBodies";
import { CelestialBody } from "../types/celestial-body";
const systemPrompts: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a AI Astronomy expert called Ad Astra. It is sometime in the future. You have been tasked to be a trip planner for planets and exoplanets that users may want to visit. Keep your responses very concise but creative. If you do not have data about a specific exoplanet, pretend that you do, without offering information that is not scientifically plausable. Responses should be under 20 words.",
  },
];
export const chat = async (
  userText: string,
  pastMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<string> => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: systemPrompts.concat(
      pastMessages.concat({ role: "user", content: userText }),
    ),
  });

  const content = completion.choices[0].message.content
    ? completion.choices[0].message.content
    : "Error";

  return content;
};

export const requestNewFilterConfig = async (
  userText: string,
  currentFilterConfig: CelestialBodyFilterConfig,
): Promise<CelestialBodyFilterConfig> => {
  const filterConfigSystemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
    [
      {
        role: "system",
        content: `You are a planet visualization tool. Given the user's message, determine if any changes need to be made to the following Filter Config: ${JSON.stringify(
          currentFilterConfig,
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
          filterConfigSystemPrompt.concat({ role: "user", content: userText }),
        ),
      });

      const content = completion.choices[0].message.content || "Error";

      const newFilterConfig: CelestialBodyFilterConfig = JSON.parse(content);
      return newFilterConfig;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }
  console.warn("Returning default filter config after 5 failed attempts.");
  return currentFilterConfig; // Return the original config if all attempts fail
};

export const changeSettingsDecisionTree = async (userText: string) => {
  const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You must decide the nature of the user's question or command. If they are attempting to change the Filters for which planets are visible, such as mass, radius, or distance, return '1'. If they are attempting to 'select' one or more planets for more information or asking about specific questions about their view, return '2'. If they are simply asking for information, return '3'. Do not provide any characters other than the number '1', '2', or '3'. Do not include punctuation.`,
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
          systemPrompt.concat({ role: "user", content: userText }),
        ),
      });

      const content = completion.choices[0].message.content || "Error";

      const result: number = parseInt(content);
      if (result < 1 || result > 3) {
        throw new Error("Something went wrong");
      }
      return result;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }
  console.warn("Returning default value after 5 failed attempts.");
  return 3;
};

export const highlightSomePlanets = async (
  userText: string,
  planetsInView: CelestialBody[],
) => {
  const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a planet selector in a virtual galactic observatory. The user is currently viewing the following planets and has requested more information: ${planetsInView.map(
        (t) => t.name,
      )} Given that list, consider the user's prompt and return a valid JSON string in the following format, selecting as few planets as is reasonable: {"highlightedCelestialBodies": [{"name": "string"}, ... ]}`,
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
          systemPrompt.concat({ role: "user", content: userText }),
        ),
      });

      const content = completion.choices[0].message.content || "Error";

      const result = JSON.parse(content);
      if (!result.highlightedCelestialBodies) {
        throw new Error("Something went wrong");
      }
      console.log(JSON.stringify(result.highlightedCelestialBodies));
      const test = planetsInView.filter((body) =>
        (result.highlightedCelestialBodies as any[]).some(
          (res) => res.name === body.name,
        ),
      );
      console.log(test);
      return test;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }
  console.warn("Returning default value after 5 failed attempts.");
  return [];
};

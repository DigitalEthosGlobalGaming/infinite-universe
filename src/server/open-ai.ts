"use server";
import OpenAI from "openai";

export async function getOpenAiApiClient() {
  const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
  };
  return new OpenAI(configuration);
}

export async function createChatCompletion(
  prompt: string | string[]
): Promise<string> {
  if (Array.isArray(prompt)) {
    prompt = prompt.join("\n");
  }

  let request: any = {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
  };

  var openAiClient = await getOpenAiApiClient();
  let response = (await openAiClient.chat.completions.create(request)) as any;

  let responseContent = response.choices[0].message.content ?? "";

  return responseContent;
}

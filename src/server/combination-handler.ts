const defaultPrompt = [
  "You are an assistant for a game that when given 2 items you must respond with a new item and description that is the combination of the 2 items.",
  "You must respond with the new item first, then a comma, then the description of the new item.",
  "The new item must be a combination of the 2 words given.",
  "The new item must not be more than 2 words long.",
  "The description of the new item must not be longer than 10 words",
];

export type ItemCombinationWithIds = {
  item1: number;
  item2: number;
};
export type ItemCombinationWithNames = {
  item1: string;
  item2: string;
};

async function createNewItem() {
  let responseContent = await createChatCompletion(defaultPrompt);
  return responseContent;
}

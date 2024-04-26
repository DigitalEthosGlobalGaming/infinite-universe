import { getDatabase } from "@/data/database";
import {
  ItemCombinationTable,
  ItemCombinationTableRecord,
  createItemCombination,
  getExistingItemCombination,
} from "@/data/tables/item-combination-table";
import {
  ItemTable,
  ItemTableRecord,
  createItem,
  getItemTableRecordById,
  toValidItemName,
} from "@/data/tables/item-table";
import { Expression, SqlBool } from "kysely";
import { createChatCompletion } from "./open-ai";

export type ItemCombinationWithIds = {
  item1: number;
  item2: number;
};
export type ItemCombinationWithNames = {
  item1: string;
  item2: string;
};

export type ItemCombination = {
  item1: ItemTable | null;
  item2: ItemTable | null;
};

async function saveItems(items: ItemTable[]): Promise<ItemTable[]> {
  const db = await getDatabase();
  const toSave: any[] = items.map((item) => ({ ...item }));
  const insertResults = await db
    .insertInto("item")
    .returningAll()
    .values(toSave)
    .execute();

  return insertResults as any;
}

export type CombinationResult = {
  item1: ItemTableRecord;
  item2: ItemTableRecord;
  result: ItemTableRecord | null;
  combination: ItemCombinationTableRecord | null;
};

export async function getCombination(
  combination:
    | ItemCombinationWithIds
    | ItemCombinationWithNames
    | ItemCombination
): Promise<CombinationResult> {
  let item1: ItemTableRecord | null = null;
  let item2: ItemTableRecord | null = null;

  const db = await getDatabase();
  // If the combination is given as names, convert them to ids
  if (
    typeof combination.item1 === "string" &&
    typeof combination.item2 === "string"
  ) {
    const item1Name = toValidItemName(combination.item1?.toString());
    const item2Name = toValidItemName(combination.item2?.toString());
    const request = db
      .selectFrom("item")
      .selectAll()
      .where((eb) => {
        const ors = [];
        ors.push(
          eb(eb.fn("lower", ["item.name"]), "like", item1Name.toLowerCase())
        );
        ors.push(
          eb(eb.fn("lower", ["item.name"]), "like", item2Name.toLowerCase())
        );
        return eb.or(ors);
      });

    const items = await request.execute();

    item1 = items.find(
      (item) => item.name.toLowerCase() === item1Name.toLowerCase()
    ) as any;
    item2 = items.find(
      (item) => item.name.toLowerCase() === item2Name.toLowerCase()
    ) as any;
  } else if (
    typeof combination.item1 === "number" &&
    typeof combination.item2 === "number"
  ) {
    let item1Id: number = 0;
    let item2Id: number = 0;
    if (typeof combination.item1 === "number") {
      item1Id = combination.item1;
    } else {
      throw new Error("Item 1 is not a number");
    }

    if (typeof combination.item2 === "number") {
      item2Id = combination.item2;
    } else {
      throw new Error("Item 2 is not a number");
    }
    if (item1Id <= 0) {
      throw new Error("Item 1 id is not valid");
    }
    if (item2Id <= 0) {
      throw new Error("Item 2 id is not valid");
    }
    const items = await db
      .selectFrom("item")
      .selectAll()
      .where((eb) => eb("id", "=", item1Id).or("id", "=", item2Id))
      .execute();

    item1 = items.find((item) => item.id === item1Id) as any;
    item2 = items.find((item) => item.id === item2Id) as any;
  }

  if (item1 == null || item2 == null) {
    throw new Error("One or both items do not exist");
  }
  if (item1?.id == null || item2?.id == null) {
    throw new Error("One or both items do not have ids");
  }

  let temp = item1;
  if (item1.id > item2.id) {
    item1 = item2;
    item2 = temp;
  }

  let itemCombination: ItemTableRecord | null = null;
  let itemCombinationRecord: ItemCombinationTableRecord | null = null;

  try {
    itemCombinationRecord = await getExistingItemCombination(
      item1.id,
      item2.id
    );
    if (itemCombinationRecord?.result_item_id != null) {
      itemCombination = await getItemTableRecordById(
        itemCombinationRecord?.result_item_id
      );
    }
  } catch (e) {
    console.error(e);
  }

  return {
    item1: item1,
    item2: item2,
    result: itemCombination,
    combination: itemCombinationRecord,
  };
}

export async function getOrCreateCombination(
  combination:
    | ItemCombinationWithIds
    | ItemCombinationWithNames
    | ItemCombination
): Promise<CombinationResult | null> {
  const combinationRecord = await getCombination(combination);
  if (combinationRecord?.result != null) {
    return combinationRecord;
  }
  const newResult = await requestCombinationFromOpenAi(
    combinationRecord.item1.name,
    combinationRecord.item2.name
  );

  const newCombination: CombinationResult = {
    item1: combinationRecord.item1,
    item2: combinationRecord.item2,
    result: newResult,
    combination: await createItemCombination({
      first_item_id: combinationRecord.item1.id,
      second_item_id: combinationRecord.item2.id,
      result_item_id: newResult.id,
    }),
  };

  return newCombination;
}

export async function requestCombinationFromOpenAi(
  name1: string,
  name2: string
) {
  const defaultPrompt = [
    "You are an assistant for a game that when given 2 items you must respond with a new item and description that is the combination of the 2 items.",
    "You must respond with the new item first, then a comma, then the description of the new item.",
    "The new item must be a combination of the 2 words given.",
    "The new item must not be more than 2 words long.",
    "The new item must be a real thing and not something made up",
    "The description of the new item must not be longer than 10 words",
  ];
  const prompt = [...defaultPrompt, `Item 1 is ${name1}`, `Item 2 is ${name2}`];
  const response = await createChatCompletion(prompt);

  // Get up to the first comma
  const responseParts = response.split(",");
  const newItemName = responseParts[0].trim();
  // Description is everything after the comma
  const description = responseParts.slice(1).join(",").trim();
  const newItemData = {
    name: newItemName,
    description: description,
  };
  return await createItem(newItemData);
}

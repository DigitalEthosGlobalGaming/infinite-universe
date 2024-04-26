import { getDatabase } from "@/data/database";
import { getOrCreateCombination } from "@/server/combination-handler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function createRandomCombination() {
  try {
    const db = await getDatabase();
    const ids = await db.selectFrom("item").select("id").execute();
    const item1 = ids[Math.floor(Math.random() * ids.length)];
    const item2 = ids[Math.floor(Math.random() * ids.length)];

    const newCombination = await getOrCreateCombination({
      item1: item1.id,
      item2: item2.id,
    });

    return newCombination;
  } catch (e) {
    return null;
  }
}

export async function POST() {
  const randomAmount = 50;
  const promises = [];
  for (let i = 0; i < randomAmount; i++) {
    promises.push(createRandomCombination());
  }
  const items = await Promise.all(promises);
  // const newItem = await createItem(newItemData);
  return NextResponse.json({ data: items }, { status: 200 });
}

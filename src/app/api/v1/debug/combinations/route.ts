import { createItem } from "@/data/tables/item-table";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const baseItems = [
  "Water",
  "Air",
  "Fire",
  "Earth",
  "Light",
  "Darkness",
  "Life",
  "Death",
  "Time",
  "Space",
  "Void",
];
export async function createRandomCombination() {
  const promises = baseItems.map(async (name) => {
    const item = await createItem({ name });
    return item;
  });
  const items = await Promise.all(promises);
  return items;
}

export async function POST() {
  const items = await createRandomCombination();
  // const newItem = await createItem(newItemData);
  return NextResponse.json({ data: items }, { status: 200 });
}

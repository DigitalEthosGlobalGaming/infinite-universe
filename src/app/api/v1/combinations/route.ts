import { getAllCombinations } from "@/data/tables/item-combination-table";
import { getOrCreateCombination } from "@/server/combination-handler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, props: any) {
  const formData = await request.formData();
  const baseItem: { [key: string]: any } = {
    item_1_name: null,
    item_2_name: null,
    item_1_id: null,
    item_2_id: null,
  };
  for (var key in baseItem) {
    const formValue = formData.get(key);
    let value: any = formValue?.toString();
    if (typeof baseItem[key] === "number") {
      value = parseInt(formValue?.toString() ?? "null") ?? null;
    }
    baseItem[key] = value;
  }

  const combination = await getOrCreateCombination({
    item1: baseItem.item_1_id ?? baseItem.item_1_name,
    item2: baseItem.item_2_id ?? baseItem.item_2_name,
  });

  // const newItem = await createItem(newItemData);
  return NextResponse.json({ data: combination }, { status: 200 });
}

export async function GET() {
  const combinations = await getAllCombinations();

  return NextResponse.json({ data: combinations }, { status: 200 });
}

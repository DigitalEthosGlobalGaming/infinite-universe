import { getDatabase } from "@/data/database";
import { createItem } from "@/data/tables/item-table";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, props: any) {
  const formData = await request.formData();
  const name = formData.get("name");
  const newItemData = {
    name: name?.toString() ?? "",
  };
  const newItem = await createItem(newItemData);
  return NextResponse.json({ data: newItem }, { status: 200 });
}

export async function GET(request: NextRequest, props: any) {
  console.log(request);
  const db = await getDatabase();
  const items = await db.selectFrom("item").selectAll().execute();
  return NextResponse.json({ data: items }, { status: 200 });
}

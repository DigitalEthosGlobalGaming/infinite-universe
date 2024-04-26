import { Scenario, getOrCreateScenario, getScenario } from "@/server/scenarios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET(request: NextRequest, props: any) {
  const id = props?.params?.id;
  const force =
    request?.nextUrl?.searchParams?.get("force")?.toLowerCase()?.trim() ==
    "true";
  let scenario: Scenario | null = null;
  if (id == "current") {
    scenario = await getOrCreateScenario(force);
  } else {
    scenario = await getScenario(id);
  }
  if (scenario == null) {
    return NextResponse.json({ data: scenario }, { status: 404 });
  }
  return NextResponse.json({ data: scenario }, { status: 200 });
}

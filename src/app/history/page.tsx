/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";

import Button from "@/components/Button";
import { Scenario, getStoredScenarios } from "@/server/scenarios";

function ScenarioItem({ children }: { children: Scenario }) {
  return (
    <div>
      <a href={`/${children.id}`}>
        <Button>{children.scenario}</Button>
      </a>
      <br />
      <br />
    </div>
  );
}

async function Scenarios() {
  const items = await getStoredScenarios();
  return (
    <>
      <h1>History</h1>
      {items.map((item) => {
        return <ScenarioItem key={item.id}>{item}</ScenarioItem>;
      })}
    </>
  );
}

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Scenarios />
      </Suspense>
    </main>
  );
}

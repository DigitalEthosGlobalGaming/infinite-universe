/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";

import AlignCenter from "@/components/utilities/AlignCenter";
import Refresher from "@/components/utilities/Refresher";
import { PuzzleElement } from "./puzzle-element";
import { getOrCreateScenario } from "@/server/scenarios";

async function ImageElement({ force }: { force?: boolean }) {
  const image = await getOrCreateScenario(force ?? false);
  if (image == null) {
    return <div>Error loading image...</div>;
  }

  if (image.loading) {
    return (
      <AlignCenter>
        Generating image...
        {force != true && <Refresher interval={5} />}
      </AlignCenter>
    );
  }
  return (
    <AlignCenter>
      <PuzzleElement>{image}</PuzzleElement>
    </AlignCenter>
  );
}

export default async function Home({ searchParams }: any) {
  const force = searchParams?.force?.toString() === "true";
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageElement force={force} />
      </Suspense>
    </main>
  );
}

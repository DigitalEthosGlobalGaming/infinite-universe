/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import Image from "@/components/Image";
import AlignCenter from "@/components/utilities/AlignCenter";
import Refresher from "@/components/utilities/Refresher";
import Button from "@/components/Button";
import AlignHCenter from "@/components/utilities/AlignHCenter";
import {
  Scenario,
  getOrCreateScenario,
  getScenario,
  getStoredScenarios,
} from "../../server/combination-handler";

async function getScenarioFromId(id: string, force: boolean = false) {
  let currentScenario: Scenario | null = null;
  if (id == "current") {
    currentScenario = await getOrCreateScenario(force);
  } else {
    currentScenario = await getScenario(id);
  }

  if (currentScenario != null) {
    if (currentScenario?.loading) {
      let allScenarios = await getStoredScenarios();
      // Set current scenario to the last scenario in the list
      if (allScenarios.length > 0) {
        currentScenario = {
          ...allScenarios[allScenarios.length - 1],
          loading: true,
        };
      }
    }
  }

  return currentScenario;
}

async function ImageElement({
  force,
  children,
}: {
  force?: boolean;
  children: string;
}) {
  const image = await getScenarioFromId(children, force);
  if (image == null) {
    return <div>Error loading image...</div>;
  }
  var url = image.url ?? "";
  var scenario = image.scenario ?? "";

  if (image.loading && image.url == null) {
    return (
      <AlignCenter>
        Generating image...
        {force != true && <Refresher interval={5} />}
      </AlignCenter>
    );
  }
  return (
    <>
      {image.loading && (
        <AlignHCenter>
          <i>We are currently generating a new cute scenario for you.</i>
        </AlignHCenter>
      )}
      <AlignCenter>
        <Image src={url} alt={scenario} caption={scenario} />
      </AlignCenter>
    </>
  );
}

export default async function Home({ searchParams, params }: any) {
  let idToLoad = params?.id ?? "";
  if (idToLoad == "") {
    idToLoad = "current";
  }
  const force = searchParams?.force?.toString() === "true";
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <ImageElement force={force}>{idToLoad}</ImageElement>
        <AlignHCenter>
          <a href="/puzzle">
            <Button appearance="outline">
              Click here to complete a puzzle of this image.
            </Button>
          </a>
        </AlignHCenter>
        <hr />
        <br />

        <br />

        <AlignHCenter>
          <a href="/history">
            <Button appearance="subtle">History</Button>
          </a>
          <a href="https://github.com/tjones4701/capycute">
            <Button appearance="subtle">Source</Button>
          </a>
        </AlignHCenter>
      </Suspense>
    </main>
  );
}

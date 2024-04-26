import Network from "@/components/Network";
import AlignCenter from "@/components/utilities/AlignCenter";
import ClientOnly from "@/components/utilities/ClientOnly";
import { getAllCombinations } from "@/data/tables/item-combination-table";
import { Suspense } from "react";

export async function SSRNetwork() {
  const data = await getAllCombinations();
  const itemsMap: Record<number, any> = {};
  const linksMap: Record<string, any> = {};
  for (const i in data) {
    const item = data[i];
    itemsMap[item.item1.name] = {
      id: item.item1.name,
    };
    itemsMap[item.item2.name] = {
      id: item.item2.name,
    };
    linksMap[item.id] = {
      source: item.item1.name,
      target: item.item2.name,
    };
  }
  const networkData = {
    links: Object.values(linksMap),
    nodes: Object.values(itemsMap),
  };
  return (
    <ClientOnly>
      <Network data={networkData} />
    </ClientOnly>
  );
}
export default function Home() {
  return (
    <AlignCenter>
      <Suspense fallback={<div>Loading....</div>}>
        <SSRNetwork />
      </Suspense>
    </AlignCenter>
  );
}

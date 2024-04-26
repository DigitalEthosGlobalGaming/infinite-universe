"use client";

import { makeStyles } from "@fluentui/react-components";
import { ResponsiveNetworkCanvas } from "@nivo/network";
import { useWindowSize } from "react-use";

const useStyle = makeStyles({
  tooltipClassName: {
    paddingTop: "3px",
    paddingLeft: "3px",
    paddingRight: "3px",
    paddingBottom: "3px",
    color: "var(--colorBrandForeground1)",
    backgroundColor: "var(--colorNeutralBackground3)",
  },
});

// A function that given a string will create a random colour.
// This colour must be the same with every given string
function stringToColour(str: string) {
  str = str ?? "";
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}
export default function Network({
  data,
}: {
  data: { nodes: any[]; links: any[] };
}) {
  const { tooltipClassName } = useStyle();
  const size = useWindowSize();
  for (const i in data.nodes) {
    data.nodes[i].color = stringToColour(data.nodes[i].id);
  }
  return (
    <div style={{ width: size.width * 0.8, height: size.height * 0.8 }}>
      <ResponsiveNetworkCanvas
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={(size.height + size.width) / 2 / 15}
        centeringStrength={1.5}
        repulsivity={(size.height + size.width) / 2 / 800}
        nodeSize={10}
        nodeColor={(e: any) => e.color}
        nodeBorderWidth={1}
        linkColor={(e: any) => e.target.color}
        nodeTooltip={(e: any) => (
          <div className={tooltipClassName}>{e.node.id}</div>
        )}
        nodeBorderColor={{
          from: "color",
          modifiers: [["darker", 0.8]],
        }}
        linkThickness={4}
        motionConfig="wobbly"
      />
    </div>
  );
}

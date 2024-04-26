import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface ISpaceApart {
  children: any;
  noWrap?: boolean;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rootNoWrap: {
    flexWrap: "nowrap",
  },
  rootWrap: {
    flexWrap: "wrap",
  },
});

const SpaceApart: React.FC<ISpaceApart> = function ({
  children,
  noWrap,
}: ISpaceApart) {
  const { root, rootNoWrap, rootWrap } = useStyles();
  let className = root;
  if (noWrap) {
    className += ` ${rootNoWrap}`;
  } else {
    className += ` ${rootWrap}`;
  }
  const elements = forceArray(children);
  return <div className={className}>{elements}</div>;
};

export default SpaceApart;

"use client";
import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface IAlignVCenter {
  children: any;
  className?: string | undefined | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
  },
});

const AlignVCenter: React.FC<IAlignVCenter> = function ({
  children,
  className,
}: IAlignVCenter) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={`${root} ${className ?? ""}`}>{elements}</div>;
};

export default AlignVCenter;

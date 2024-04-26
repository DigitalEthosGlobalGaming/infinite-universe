"use client";
import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface IAlignCenter {
  children: any;
  className?: string | undefined | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const AlignCenter: React.FC<IAlignCenter> = function ({
  children,
  className,
}: IAlignCenter) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={`${root} ${className ?? ""}`}>{elements}</div>;
};

export default AlignCenter;

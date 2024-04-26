"use client";
import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface IAlignLeft {
  children: any;
  className?: string | undefined | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "flex-start",
  },
});

const AlignLeft: React.FC<IAlignLeft> = function ({
  children,
  className,
}: IAlignLeft) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={`${root} ${className ?? ""}`}>{elements}</div>;
};

export default AlignLeft;

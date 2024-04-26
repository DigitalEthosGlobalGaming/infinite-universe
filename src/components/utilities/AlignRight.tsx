"use client";
import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface IAlignRight {
  children: any;
  className?: string | undefined | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "flex-end",
  },
});

const AlignRight: React.FC<IAlignRight> = function ({
  children,
  className,
}: IAlignRight) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={`${root} ${className ?? ""}`}>{elements}</div>;
};

export default AlignRight;

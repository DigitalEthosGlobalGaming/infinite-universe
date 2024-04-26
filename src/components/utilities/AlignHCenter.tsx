"use client";
import { forceArray } from "@/utilities/force-array";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

interface IAlignHCenter {
  children: any;
  className?: string | undefined | null;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
  },
});

const AlignHCenter: React.FC<IAlignHCenter> = function ({
  children,
  className,
}: IAlignHCenter) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={`${root} ${className ?? ""}`}>{elements}</div>;
};

export default AlignHCenter;

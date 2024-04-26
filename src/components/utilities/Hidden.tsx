"use client";
import { makeStyles } from "@fluentui/react-components";
import React from "react";

type IVisuallyHidden = {
  children: any;
  show?: boolean;
};

const useStyles = makeStyles({
  root: {
    display: "none",
  },
});

const VisuallyHidden: React.FC<IVisuallyHidden> = function ({
  show,
  children,
}: IVisuallyHidden) {
  const { root } = useStyles();
  let className = "";
  if (show !== true) {
    className = root;
  }

  return <div className={className}>{children}</div>;
};

export default VisuallyHidden;

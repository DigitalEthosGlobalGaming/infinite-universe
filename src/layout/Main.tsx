"use client";

import { makeStyles } from "@fluentui/react-components";
import React from "react";

const useStyles = makeStyles({
  rootClassName: {
    minHeight: "99vh",
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
});

type MainProps = {
  children: React.ReactNode | React.ReactNode[];
};

const Main: React.FC<MainProps> = ({ children }) => {
  const { rootClassName } = useStyles();
  return <div className={rootClassName}>{children}</div>;
};

export default Main;

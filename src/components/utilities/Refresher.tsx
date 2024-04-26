"use client";
import React, { useEffect } from "react";

const Refresher: React.FC<{ interval: number }> = ({ interval }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      window.location.reload();
    }, interval * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return null;
};

export default Refresher;

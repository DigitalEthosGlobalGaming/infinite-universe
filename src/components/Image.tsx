"use client";
/* eslint-disable @next/next/no-img-element */

import React from "react";
import AlignHCenter from "./utilities/AlignHCenter";
import { makeStyles } from "@fluentui/react-components";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

const useStyles = makeStyles({
  imageClassName: {
    maxWidth: "100%",
    maxHeight: "80vh",
    height: "auto",
  },
  containerClassName: {
    maxHeight: "100%",
  },
});

const Image: React.FC<ImageProps> = ({ src, alt, className, caption }) => {
  const { imageClassName, containerClassName } = useStyles();
  let fullClassName = `${containerClassName} ${imageClassName} ${className}`;
  if (caption?.trim() ?? "" != "") {
    return (
      <figure className={fullClassName}>
        <img src={src} alt={alt} className={imageClassName} loading="lazy" />
        <AlignHCenter>
          <figcaption>{caption}</figcaption>
        </AlignHCenter>
      </figure>
    );
  }

  return <img src={src} alt={alt} className={imageClassName} loading="lazy" />;
};

export default Image;

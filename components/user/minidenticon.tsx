"use client";
import { minidenticon } from "minidenticons";
import Image from "next/image";
import { useMemo } from "react";
export const MinidentIconImg = ({
  username,
  saturation,
  lightness,
  ...props
}: {
  username: string;
  saturation: string;
  lightness: string;
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return (
    <Image
      src={svgURI}
      alt={username}
      {...props}
      style={{ width: "100%", height: "auto" }} // optional
      width={0}
      height={0}
      sizes="100vw"
    />
  );
};
export const MinidentIconURI = ({
  username,
  saturation,
  lightness,
  ...props
}: {
  username: string;
  saturation: string;
  lightness: string;
}) => {
  const svgURI = useMemo(
    () =>
      "data:image/svg+xml;utf8," +
      encodeURIComponent(minidenticon(username, saturation, lightness)),
    [username, saturation, lightness]
  );
  return svgURI;
};

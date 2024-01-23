"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Logo() {
  const { theme } = useTheme();
  const [imageSrc, setImageSrc] = useState<string>(
    theme === "light" ? "/woel-light.svg" : "/woel-dark.svg"
  );
  useEffect(() => {
    setImageSrc(theme === "light" ? "/woel-light.svg" : "/woel-dark.svg");
  }, [theme]);

  return <Image src={imageSrc} alt="logo" width={50} height={50}></Image>;
}

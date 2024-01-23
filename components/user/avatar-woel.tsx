"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { MinidentIconURI } from "./minidenticon";

interface AvatarProps {
  avatar_url: string;
  username: string;
  height?: number;
  width?: number;
}

export const AvatarWoel = ({
  avatar_url,
  username,
  height,
  width,
}: AvatarProps) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="flex justify-center">
      <Avatar className={`mt-2 `} style={{ height: height, width: width }}>
        <AvatarImage
          src={
            avatar_url
              ? avatar_url
              : MinidentIconURI({
                  username: username ? username : "user",
                  saturation: "90",
                  lightness: "50",
                })
          }
          onLoad={() => setLoaded(true)}
        />
        <AvatarFallback>
          <Skeleton />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

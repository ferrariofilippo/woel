"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Icons } from "../icons";
import { MinidentIconImg } from "./minidenticon";

export const AvatarWoel = ({
  avatar_url,
  username,
}: {
  avatar_url: string;
  username: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="flex justify-center">
      <Avatar className="w-28 h-28 mt-2">
        <AvatarImage src={avatar_url} onLoad={() => setLoaded(true)} />
        <AvatarFallback>
          {!avatar_url && (
            <MinidentIconImg
              username={username}
              saturation="90"
              lightness="50"
            />
          )}
          {avatar_url && !loaded && <Icons.spinner />}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

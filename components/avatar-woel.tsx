"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { MinidentIconURI } from "./user/minidenticon";

interface AvatarProps {
  avatar_url: string;
  username: string;
  height?: number;
  width?: number;
}

export const WoelAvatar = ({
  avatar_url,
  username,
  height,
  width,
}: AvatarProps) => {
  return (
    <div className="flex justify-center">
      <Avatar className={`p-1`} style={{ height: height, width: width }}>
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
        />
        <AvatarFallback>
          <Skeleton />
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

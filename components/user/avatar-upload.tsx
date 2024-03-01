"use client";
import { getAvatarURL } from "@/lib/api/user";
import { SUPABASE_URL } from "@/lib/costants";
import { UserData } from "@/types/api";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { WoelAvatar } from "../avatar-woel";
import { Icons } from "../icons";
import { Button } from "../ui";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

var sprintf = require("sprintf-js").sprintf,
  vsprintf = require("sprintf-js").vsprintf;

export default function AvatarUpload({ profile }: { profile: UserData }) {
  const i18nCommon = useTranslations("Common");
  const i18n = useTranslations("Validation");
  const i18nUser = useTranslations("User");

  const [avatar, setAvatar] = useState<string>("");
  useEffect(() => {
    setAvatarURL();
  });
  const supabase: any = createClientComponentClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [file, setFile] = useState<any>([]);
  const isFilePFPSupported = (fileType: any) => {
    switch (fileType) {
      case "image/png":
        return true;
      case "image/jpeg":
        return true;
      case "image/gif":
        return true;
      default:
        return false;
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (file && isFilePFPSupported(file?.type)) {
      setIsLoading(true);
      const filename = `${uuidv4()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        toast({
          variant: "destructive",
          title: i18nCommon("Error"),
          description: error.message,
        });
      }
      const filepath = data?.path;
      await supabase
        .from("user_data")
        .update({
          avatar_url: `${SUPABASE_URL}/storage/v1/object/public/avatars/${filepath}`,
        })
        .eq("id", profile.id);
      await setAvatarURL();
      setIsLoading(false);
    } else {
      if (!file) {
        toast({
          variant: "destructive",
          description: sprintf(i18n("Select"), i18nCommon("Photo")),
        });
      } else if (!isFilePFPSupported(file.type)) {
        toast({
          variant: "destructive",
          description: sprintf(
            i18n("InvalidFormatMustBe"),
            ".PNG .JPEG or .GIF"
          ),
        });
      }
    }
  };
  const setAvatarURL = async () => {
    let res = await getAvatarURL(supabase, profile.id);
    if (res) {
      let user_data: UserData = res.data;
      setAvatar(user_data.avatar_url!);
    }
  };
  const handleFileSelected = (e: any) => {
    setFile(e.target.files[0]);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full max-w-sm items-center gap-2 my-3">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={handleFileSelected} />
      </div>
      <Button type="submit" disabled={isLoading} variant="secondary">
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          i18nUser("UpdateAvatar")
        )}
      </Button>
      <WoelAvatar
        username={profile.username!}
        avatar_url={avatar!}
        height={120}
        width={120}
      />
    </form>
  );
}

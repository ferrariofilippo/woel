"use client";

import { Button } from "@/components/ui";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BASE_URL } from "@/lib/costants";
import { School, Specialization, UserData } from "@/types/api";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Icons } from "../icons";
import { DropDownFieldTemplate, WoelDropdown } from "../profile/woel-dropdown";
import { Input } from "../ui/input";
import AvatarUpload from "../user/avatar-upload";
import WoelForm from "../woel/woel-form";

var sprintf = require("sprintf-js").sprintf,
  vsprintf = require("sprintf-js").vsprintf;

interface ProfileFormProps {
  profile: UserData;
  schools: School[];
  specializations: Specialization[];
  redirectOnSumbit?: boolean;
}
export function ProfileForm({
  profile,
  schools,
  specializations,
  redirectOnSumbit,
}: ProfileFormProps) {
  const i18n = useTranslations("ProfileForm");
  const i18nValidation = useTranslations("Validation");

  const i18nCommon = useTranslations("Common");
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [schoolSpecializations, setSpecializations] =
    useState<Specialization[]>(specializations);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const profileFormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message: sprintf(
          i18nValidation("MustbBeLeastChars"),
          i18nCommon("Username"),
          "2"
        ),
      })
      .max(30, {
        message: sprintf(
          i18nValidation("MustBeUnderChars"),
          i18nCommon("Username"),
          "30"
        ),
      }),
    full_name: z
      .string()
      .min(2, {
        message: sprintf(
          i18nValidation("MustbBeLeastChars"),
          i18nCommon("Name"),
          "2"
        ),
      })
      .max(30, {
        message: sprintf(
          i18nValidation("MustBeUnderChars"),
          i18nCommon("Name"),
          "30"
        ),
      }),
    school_name: z.number(),
    specialization_name: z.number(),
  });
  type ProfileFormValues = z.infer<typeof profileFormSchema>;
  const defaultValues: Partial<ProfileFormValues> = {
    username: profile.username!,
    full_name: profile.full_name!,
    school_name: profile.school_id!,
    specialization_name: profile.specialization_id!,
  };

  const form = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    reValidateMode: "onChange",
  });
  const watchSchool = form.watch("school_name", profile.school_id!);
  const fetchSpecializations = async (school_name: number) => {
    const response = await fetch(
      `${BASE_URL}/api/schools/${school_name}/specializations`
    );
    const data: Specialization[] = await response.json();
    setSpecializations(data);
  };
  useEffect(() => {
    fetchSpecializations(watchSchool);
  }, [watchSchool]);

  const onSubmit = async (formData: ProfileFormValues) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("user_data")
      .update({
        username: formData.username,
        full_name: formData.full_name,
        school_id: formData.school_name,
        specialization_id: formData.specialization_name,
      })
      .eq("id", profile.id)
      .select()
      .single();
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return error;
    }
    toast({
      description: i18n("UpdatedSuccess"),
    });
    if (redirectOnSumbit) {
      router.push("/");
      router.refresh();
    }
  };
  return (
    <div className="flex max-w-sm flex-row px-6mi">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">{i18n("UserDetails")}</TabsTrigger>
          <TabsTrigger value="avatar">{i18n("UserAvatar")}</TabsTrigger>
          <TabsTrigger value="password">{i18n("SchoolDetails")}</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-6" value="avatar">
          <AvatarUpload profile={profile} />
        </TabsContent>
        <WoelForm sumbit={form.handleSubmit(onSubmit)} form={form}>
          <TabsContent className="flex flex-col gap-6" value="account">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{}</FormLabel>
                  <FormControl>
                    <Input placeholder={i18n("YourName")} {...field} />
                  </FormControl>
                  <FormDescription>
                    {i18n("FullNameDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{i18nCommon("Username")}</FormLabel>
                  <FormControl>
                    <Input placeholder={i18n("YourName")} {...field} />
                  </FormControl>
                  <FormDescription>{i18n("DisplayedUsername")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="password">
            <WoelDropdown
              form={form}
              fieldTemplate={
                {
                  label: "school_name",
                  value: "id",
                  name: i18nCommon("School"),
                } as DropDownFieldTemplate
              }
              collection={schools as any[]}
              dropdownDescription={i18n("SchoolDescription")}
            />
            <WoelDropdown
              form={form}
              fieldTemplate={
                {
                  label: "specialization_name",
                  value: "id",
                  name: i18nCommon("Specialization"),
                } as DropDownFieldTemplate
              }
              collection={schoolSpecializations as any[]}
              dropdownDescription={i18n("SpecializationDescription")}
            />
          </TabsContent>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              i18n("UpdateAccount")
            )}
          </Button>
        </WoelForm>
      </Tabs>
    </div>
  );
}

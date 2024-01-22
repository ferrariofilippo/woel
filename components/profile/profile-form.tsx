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
import { ProfileFormValues, profileFormSchema } from "@/lib/validation";
import { School, Specialization, UserData } from "@/types/api";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import AvatarUpload from "../user/avatar-upload";
import WoelForm from "../woel/woel-form";
import { DropDownFieldTemplate, WoelDropdown } from "./woel-dropdown";

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
  const { toast } = useToast();

  const supabase = createClientComponentClient();
  const [schoolSpecializations, setSpecializations] =
    useState<Specialization[]>(specializations);
  // const [requestError, setRequestError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

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
    } else {
      toast({
        description: "Updated Profile",
      });
    }
    if (redirectOnSumbit) {
      router.push("/");
      router.refresh();
    }
  };
  return (
    <div className="flex max-w-sm flex-row px-6mi">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">User Info</TabsTrigger>
          <TabsTrigger value="avatar">User Avatar</TabsTrigger>
          <TabsTrigger value="password">School Info</TabsTrigger>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the username that will be displayed on your profile.
                  </FormDescription>
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
                  name: "School",
                } as DropDownFieldTemplate
              }
              collection={schools as any[]}
            />
            <WoelDropdown
              form={form}
              fieldTemplate={
                {
                  label: "specialization_name",
                  value: "id",
                  name: "Specializations",
                } as DropDownFieldTemplate
              }
              collection={schoolSpecializations as any[]}
              dropdownDescription="This is the school specialization"
            />
          </TabsContent>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Update account"
            )}
          </Button>
        </WoelForm>
      </Tabs>

      {/* {requestError !== "" && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{requestError}</AlertDescription>
        </Alert>
      )} */}
    </div>
  );
}

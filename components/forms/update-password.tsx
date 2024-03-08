"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

var sprintf = require("sprintf-js").sprintf,
  vsprintf = require("sprintf-js").vsprintf;

export function UpdatePasswordForm() {
  const i18n = useTranslations("Validation");
  const i18nCommon = useTranslations("Common");
  const i18nLogin = useTranslations("Login");

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClientComponentClient();

  const updatePasswordFormSchema = z
    .object({
      password: z
        .string()
        .refine((password) => /\d/.test(password), {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("Eight"),
            i18nCommon("Number")
          ),
        })
        .refine((password) => /\W|_/.test(password), {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("One"),
            i18nCommon("SpecialCharacter")
          ),
        })
        .refine((password) => /[A-Z]/.test(password), {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("One"),
            i18nCommon("UppercaseChar")
          ),
        })
        .refine((password) => /[a-z]/.test(password), {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("One"),
            i18nCommon("LowerCaseChar")
          ),
        })
        .refine((password) => password.length >= 8, {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("Eight"),
            i18nCommon("Characters")
          ),
        }),
      confirmPassword: z.string(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: sprintf(i18n("XDidNotMatch"), "Password"),
          path: ["confirmPassword"],
        });
      }
    });

  type UpdatePasswordFormValues = z.infer<typeof updatePasswordFormSchema>;
  const defaultValues: Partial<UpdatePasswordFormValues> = {};

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function updateUserPassword(data: UpdatePasswordFormValues) {
    setIsLoading(true);
    let { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }
    toast({
      description: i18n("UpdatedSuccess"),
    });
    router.push("/");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(updateUserPassword)}
        className="flex flex-col   justify-center gap-3 "
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{i18nLogin("ConfirmPassword")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{i18nLogin("UpdateAccount")}</Button>
      </form>
    </Form>
  );
}

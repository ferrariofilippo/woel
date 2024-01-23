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
import {
  UpdatePasswordFormValues,
  updatePasswordFormSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

// This can come from your database or API.
const defaultValues: Partial<UpdatePasswordFormValues> = {};
export function UpdatePasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClientComponentClient();
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
      description: "Password updated succesfully!",
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
              <FormLabel>Confirm password</FormLabel>
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

        <Button type="submit">Update password</Button>
      </form>
    </Form>
  );
}

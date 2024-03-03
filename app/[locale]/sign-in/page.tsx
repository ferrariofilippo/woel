"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { createBrowserClient } from "@supabase/ssr";
import * as caseChange from "change-case";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

var sprintf = require("sprintf-js").sprintf,
  vsprintf = require("sprintf-js").vsprintf;

export default function AuthenticationPage() {
  const t = useTranslations("Login");
  const i18n = useTranslations("Validation");
  const i18nCommon = useTranslations("Common");
  const signInValidationSchema = z.object({
    email: z
      .string({
        required_error: sprintf(i18n("IsRequired"), i18nCommon("Email")),
      })
      .email(sprintf(i18n("EnterValid"), i18nCommon("Email"))),
    password: z
      .string({
        required_error: sprintf(i18n("IsRequired"), i18nCommon("Password")),
      })
      .min(1),
    confirmPassword: z.string(),
  });
  const signUpValidationSchema = z
    .object({
      email: z
        .string()
        .min(1, { message: sprintf(i18n("IsRequired"), i18nCommon("Email")) })
        .email({
          message: sprintf(i18n("EnterValid"), i18nCommon("Email")),
        }),
      password: z
        .string()
        .refine((password) => /\d/.test(password), {
          message: sprintf(
            i18n("MustContainLeast"),
            "Password",
            i18nCommon("One"),
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
            i18nCommon("One"),
            i18nCommon("Characters")
          ),
        }),
      confirmPassword: z.string(),
    })
    .superRefine(({ password, confirmPassword }, context) => {
      if (password !== confirmPassword) {
        context.addIssue({
          code: "custom",
          message: sprintf(i18n("XDidNotMatch"), "Password"),
          path: ["confirmPassword"],
        });
      }
    });
  const passwordResetValidationSchema = z.object({
    email: z
      .string({
        required_error: sprintf(i18n("IsRequired"), i18nCommon("Email")),
      })
      .email(sprintf(i18n("EnterValid"), i18nCommon("Email"))),
  });

  type PasswordResetValidationSchema = z.infer<
    typeof passwordResetValidationSchema
  >;
  type SignInValidationSchema = z.infer<typeof signInValidationSchema>;
  type SignUpValidationSchema = z.infer<typeof signUpValidationSchema>;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState("sign-in");
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValidationSchema>({
    mode: "onChange",
    resolver: zodResolver(
      view === "sign-in"
        ? signInValidationSchema
        : view === "password-reset"
        ? passwordResetValidationSchema
        : signUpValidationSchema
    ),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signUp = async (user: SignUpValidationSchema) => {
    const email = user.email;
    const password = user.password;

    let { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/sign-in/complete-profile`,
      },
    });
    setIsLoading(false);
    if (error || data?.user?.aud === "authenticated") {
      toast({
        variant: "destructive",
        title: caseChange.sentenceCase(i18nCommon("Error")),
        description: t("MailUsed"),
      });

      resetField("email");
      resetField("password");
      resetField("confirmPassword");
      return;
    }

    toast({
      description: t("CheckInbox") + " " + data.user?.email,
    });
    setView("email");
  };
  const signIn = async (user: SignInValidationSchema) => {
    const email = user.email;
    const password = user.password;
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: caseChange.sentenceCase(i18nCommon("Error")),
        description: i18n(caseChange.pascalCase(error.message)),
      });

      resetField("password");
      return error;
    }
    toast({
      variant: "default",
      description: t("SignInSuccessful"),
    });
    router.push("/");
    router.refresh();
  };
  const providerSignIn = async (provider: any) => {
    setIsLoading(true);
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: caseChange.sentenceCase(i18nCommon("Error")),
        description: i18n(caseChange.pascalCase(error.message)),
      });
      return error;
    }
    toast({
      variant: "default",
      description: t("SignInSuccessful"),
    });
    router.refresh();
  };

  const passwordReset = async (user: PasswordResetValidationSchema) => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo: `${location.origin}/auth/callback?next=/sign-in/update-password`,
      }
    );
    router.refresh();
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: caseChange.sentenceCase(i18nCommon("Error")),
        description: i18n(caseChange.pascalCase(error.message)),
      });
      return;
    }
    toast({
      variant: "default",
      description: t("UpdatedPassword"),
    });
    setView("password-reset-confirmation");
  };

  const switchToSignIn = () => {
    resetField("password");
    resetField("confirmPassword");
    setView("sign-in");
  };
  const switchToSignUp = () => {
    resetField("password");
    setView("sign-up");
  };

  return (
    <div>
      {view === "email" ? (
        <p className="text-sm text-muted-foreground text-center">
          {t("CheckInbox")}
        </p>
      ) : view === "password-reset" ? (
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("RecoverPassword")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("SentResetEmail")}
            </p>
          </div>
          <form onSubmit={handleSubmit(passwordReset)}>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="filled_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <Button disabled={isLoading}>
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reset"
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : view === "password-reset-confirmation" ? (
        <div>
          <p className="text-sm text-muted-foreground text-center">
            {t("CheckInbox")}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {view === "sign-in" ? t("SignIn") : t("SignUp")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {view === "sign-in"
                ? t("SignInEnterEmail")
                : t("SignUpEnterEmail")}
            </p>
          </div>
          <form onSubmit={handleSubmit(view === "sign-in" ? signIn : signUp)}>
            <div className="grid gap-1">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="filled_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p
                    id="filled_error_help"
                    className="mt-2 text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.password?.message}
                  </p>
                )}
              </div>
              {view !== "sign-in" && (
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="password">{t("ConfirmPassword")}</Label>
                  <Input
                    id="confirm-password"
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p
                      id="filled_error_help"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {errors.confirmPassword?.message}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2 justify-center mt-3 items-center">
                <Button className="w-max" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {view === "sign-in" ? t("SignIn") : t("SignUp")}
                </Button>
              </div>
              {view === "sign-in" ? (
                <div>
                  <p className="text-sm text-muted-foreground text-center">
                    {t("DontHaveAccount")}
                    <Button
                      variant="link"
                      onClick={switchToSignUp}
                      type="button"
                    >
                      {t("SignUpNow")}
                    </Button>
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    <Button
                      variant="link"
                      onClick={() => setView("password-reset")}
                    >
                      {t("ForgotYourPassword")}
                    </Button>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  {t("AlreadyHaveAccount")}
                  <Button variant="link" onClick={switchToSignIn} type="button">
                    {t("SignInNow")}
                  </Button>
                </p>
              )}
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("ContinueWith")}
              </span>
            </div>
          </div>
          <div className="flex gap-1 justify-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => providerSignIn("github")}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              Github
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => providerSignIn("google")}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => providerSignIn("discord")}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.discord className="mr-2 h-4 w-4" />
              )}
              <p className="ml-2">Discord</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

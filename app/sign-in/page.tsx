"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  PasswordResetValidationSchema,
  SignInValidationSchema,
  SignUpValidationSchema,
  passwordResetValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
export default function AuthenticationPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState("sign-in");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const {
    register,
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
    },
  });
  const signUp = async (user: SignUpValidationSchema) => {
    setIsLoading(true);
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
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }
    toast({
      description: "We sent you a confirmation email to : " + data.user?.email,
    });
    setView("email");
  };
  const signIn = async (user: SignInValidationSchema) => {
    setIsLoading(true);
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
        title: "Error",
        description: error.message,
      });
      return error;
    }
    toast({
      variant: "default",
      description: "Login succesful",
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
        title: "Error",
        description: error.message,
      });
      return error;
    }
    toast({
      variant: "default",
      description: "Login succesful",
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
        title: "Error",
        description: error.message,
      });
      return;
    }
    toast({
      variant: "default",
      description: "Updated password",
    });
    setView("password-reset-confirmation");
  };
  return (
    <div>
      {view === "email" ? (
        <p className="text-sm text-muted-foreground text-center">
          Check your email address
        </p>
      ) : view === "password-reset" ? (
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Recover your password
            </h1>
            <p className="text-sm text-muted-foreground">
              You ll receive an email to reset your password
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
            Check your email address
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {view === "sign-in"
                ? "Log in to your account"
                : "Sign in to your acccount"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {view === "sign-in"
                ? "Enter your email below to sign in to your account"
                : "Enter your email below to create your account"}
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
              <div className="flex flex-col gap-2 justify-center mt-3 items-center">
                {/* {requestError !== "" && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{requestError}</AlertDescription>
                  </Alert>
                )} */}
                <Button className="w-max" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {view === "sign-in" ? "Sign In" : "Sign Up"}
                </Button>
              </div>
              {view === "sign-in" ? (
                <div>
                  <p className="text-sm text-muted-foreground text-center">
                    Dont have an account?
                    <Button variant="link" onClick={() => setView("sign-up")}>
                      Sign up now!
                    </Button>
                  </p>
                  <p className="text-sm text-muted-foreground text-center">
                    <Button
                      variant="link"
                      onClick={() => setView("password-reset")}
                    >
                      Forgot your password?
                    </Button>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?
                  <Button variant="link" onClick={() => setView("sign-in")}>
                    Sign in now!
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
                Or continue with
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

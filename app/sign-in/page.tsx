"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInValidationSchema = z.object({
  email: z
    .string({ required_error: "Email richiesta" })
    .email("Email non valida"),
  password: z.string({ required_error: "Password richiesta" }),
});

const signUpValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email richiesta" })
    .email({
      message: "La mail inserita non è valida",
    }),
  password: z
    .string()
    .refine((password) => /\d/.test(password), {
      message: "La password deve contenere almeno un numero",
    })
    .refine((password) => /\W|_/.test(password), {
      message: "La password deve contenere almeno un carattere speciale",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "La password deve contenere almeno una lettere maiuscola",
    })
    .refine((password) => password.length >= 8, {
      message: "La password deve essere lunga almeno 8 caratteri",
    }),
});

type SignInValidationSchema = z.infer<typeof signInValidationSchema>;
type SignUpValidationSchema = z.infer<typeof signUpValidationSchema>;

export default function AuthenticationPage() {
  const loginString = "Accedi al tuo account";
  const signupString = "Crea un account";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [view, setView] = useState("sign-in");
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValidationSchema>({
    mode: "onChange",
    resolver: zodResolver(
      view === "sign-in" ? signInValidationSchema : signUpValidationSchema
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const signUp = async (user: SignUpValidationSchema) => {
    const email = user.email;
    const password = user.password;

    setIsLoading(true);
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);

    setView("email");
  };
  const signIn = async (user: SignInValidationSchema) => {
    const email = user.email;
    const password = user.password;

    setIsLoading(true);
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    router.push(location.origin);
  };

  return (
    <div className="container md:py-0 sm:py-16 py-8 min-h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 mt-auto">
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Benvenuti</p>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {view === "email" ? (
            <p className="text-sm text-muted-foreground text-center">
              Controlla la tua mail
            </p>
          ) : (
            <div className="grid gap-6">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {view === "sign-in"
                    ? loginString
                    : signupString }
                </h1>
                <p className="text-sm text-muted-foreground">
                  {view === "sign-in"
                    ? "Inserisci la tua email qui sotto per accedere"
                    : "Inserisci la tua email qui sotto per creare un account"}
                </p>
              </div>
              <form
                onSubmit={handleSubmit(view === "sign-in" ? signIn : signUp)}
              >
                <div className="grid gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="nome@esempio.it"
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
                        className="mt-1 text-xs text-red-600 dark:text-red-400"
                      >
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2 mt-2">
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
                        className="mt-1 text-xs text-red-600 dark:text-red-400"
                      >
                        {errors.password?.message}
                      </p>
                    )}
                  </div>
                  <Button disabled={isLoading} className="mt-5">
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {view === "sign-in"
                      ? "Accedi"
                      : "Registrati" }
                  </Button>
                  {view === "sign-in" ? (
                    <p className="text-sm text-muted-foreground text-center">
                      Non hai un account?
                      <Button variant="link" onClick={() => setView("sign-up")} type="button">
                        Registrati ora!
                      </Button>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Hai già un account?
                      <Button variant="link" onClick={() => setView("sign-in")} type="button">
                        Accedi ora!
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
                    O continua con
                  </span>
                </div>
              </div>
              <Button variant="outline" type="button" disabled={isLoading}>
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                )}{" "}
                Github
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

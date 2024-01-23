"use client"

import * as z from "zod"
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { YearSelector } from "@/components/ui/year-selector";
import { useState } from "react";

const bookFormSchema = z.object({
  author: z
    .string(),
  isbn: z
    .string()
    .length(13, "L'ISBN deve essere lungo 13 caratteri"),
  subject: z
    .string(),
  title: z
    .string(),
  year: z
    .number()
    .min(1, "L'Anno deve essere compreso tra 1 e 5")
    .max(5, "L'Anno deve essere compreso tra 1 e 5")
});

type Book = Database["public"]["Tables"]["book"]["Insert"];

const defaultValues: Partial<Book> = {
  year: 3
};

export function CreateBookForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const router = useRouter();

  const [year, setYear] = useState(3);

  const createBook = async (formData: FormData) => {
    const { error } = await supabase
      .from('book')
      .insert({
        isbn: formData.get("isbn")?.toString(),
        title: formData.get("title")?.toString(),
        author: formData.get("author")?.toString(),
        subject: formData.get("subject")?.toString(),
        year: parseInt(formData.get("year")?.toString() ?? "3")
      });

    if (!error)
      router.push("/");
  };

  const form = useForm<Book>({
    resolver: zodResolver(bookFormSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        action={createBook}
        className="flex flex-col gap-y-4 md:w-1/2 w-full mx-auto"
      >
        <input hidden value={year} readOnly name="rating" />

        <h1
          className="mt-5 mb-8 text-3xl font-semibold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white text-center"
        >
          Crea un libro
        </h1>
        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="0000000000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="La Divina Commedia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Autore</FormLabel>
              <FormControl>
                <Input placeholder="Dante Alighieri" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materia</FormLabel>
              <FormControl>
                <Input placeholder="Italiano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={() => {
            return (
              <FormItem>
                <FormControl>
                  <YearSelector
                    year={year}
                    setYear={setYear}
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />
        <div className="flex gap-x-2 w-full justify-end mt-3">
          <Button
            onClick={() => router.push("/")}
            variant="secondary"
            type="button"
          >
            Annulla
          </Button>
          <Button
            type="submit"
            className="px-10"
          >
            Crea
          </Button>
        </div>
      </form>
    </Form>
  );
}

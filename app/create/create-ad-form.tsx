"use client"

import * as z from "zod"
import { redirect } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { RatingSelector } from "@/components/ui/rating-selector";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChangeEvent, ChangeEventHandler, useState } from "react";

const advertisementFormSchema = z.object({
  book_id: z.string(),
  id: z
    .number()
    .nullable(),
  negotiable_price: z.boolean(),
  notes: z
    .string()
    .nullable(),
  owner_id: z.string(),
  price: z
    .number()
    .nonnegative("Il Prezzo deve essere un numero positivo")
    .max(99.99, "Il Prezzo deve essere inferiore di 99,99"),
  rating: z
    .number()
    .min(1, "Le Condizioni devono essere comprese tra 1 (Pessime) e 5 (Ottime)")
    .max(5, "Le Condizioni devono essere comprese tra 1 (Pessime) e 5 (Ottime)"),
  status: z.string()
});

type Advertisement = Database["public"]["Tables"]["advertisement"]["Insert"];
type AdvertisementPicture = Database["public"]["Tables"]["advertisement_picture"]["Insert"];

interface CreateAdParams {
  books: {
    isbn: string,
    title: string
  }[] | null,
  user_id: string
}

const defaultValues: Partial<Advertisement> = {
  rating: 3,
};

export function CreateAdForm({ books, user_id }: CreateAdParams) {
  const supabase = createClientComponentClient();

  const imagesUrl = Array<string>();

  const [rating, setRating] = useState(3);

  const addAdvertisement = async (formData: FormData) => {
    const { data } = await supabase
      .from('advertisement')
      .insert(formData)
      .select();

    if (!data)
      return;

    const pictures = Array<AdvertisementPicture>();

    for (const url of imagesUrl) {
      pictures.push({
        advertisement_id: data[0].id,
        id: undefined,
        url: url
      });
    }

    await supabase
      .from('advertisement_picture')
      .insert(pictures);

    redirect("/");
  };

  const postPictures = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    await removePictures();

    if (!target.files || !target.files.length)
      return;

    for (let i = 0; i < target.files.length; i++) {
      const extension = target.files[i].name.split('.').pop();
      if (["PNG", "JPG", "JPEG"].includes(extension?.toLocaleUpperCase() ?? "")) {
        const name = `${crypto.randomUUID().toString()}.${extension}`;

        await supabase.storage
          .from("images")
          .upload(name, target.files[i], {
            cacheControl: "3600",
            upsert: true,
          });

        imagesUrl.push(name);
      }
    }
  };

  const removePictures = async () => {
    await supabase.storage.from("images").remove(imagesUrl);

    while (imagesUrl.length)
      imagesUrl.pop();
  };

  const cancelCreate = () => {
    redirect("/");
  }

  const form = useForm<Advertisement>({
    resolver: zodResolver(advertisementFormSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form
        action={addAdvertisement}
      >
        <input hidden value={0} name="id" />
        <input hidden value={user_id} name="user_id" />
        <input hidden value={"Available"} name="status" />
        <input hidden value={rating} name="rating" />

        <h1
          className="mt-5 mb-12 text-3xl font-semibold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white text-center"
        >
          Crea un annuncio
        </h1>
        <div className="flex md:flex-row flex-col mx-auto mb-12 min-h-[60vh] gap-x-4 gap-y-4">
          <div className="flex lg:w-1/2 md:w-2/3 w-full items-center justify-center">
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-full md:h-full h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-accent dark:border-gray-600 dark:hover:border-gray-500"
            >
              <div
                className="flex flex-col items-center justify-center pt-5 pb-6"
              >
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p
                  className="mb-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <span className="font-semibold">Clicca per caricare</span> oppure trascina e rilascia
                </p>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  (JPG, PNG, JPEG)
                </p>
              </div>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={postPictures}
                multiple
              />
            </label>
          </div>
          <div className="lg:w-1/2 md:w-1/4 w-full flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="book_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Libro</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && books
                            ? books.find(
                              (book) => book.isbn === field.value
                            )?.title
                            : "Scegli un libro"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 p-0">
                      <Command>
                        <CommandInput placeholder="Cerca un libro..." />
                        <CommandEmpty>
                          <div className="flex flex-col">
                            Libro non trovato.
                            <a
                              className="font-semibold"
                              href={`${location.origin}/book/create`}
                            >
                              Aggiungilo tu
                            </a>
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {books?.map((book) => (
                            <CommandItem
                              value={book.isbn}
                              key={book.isbn}
                              onSelect={(value) => {
                                form.setValue("book_id", value)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  book.isbn === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div
                                className="flex flex-col"
                              >
                                {book.title}
                                <span
                                  className="text-sm"
                                >
                                  {book.isbn}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <div className="flex lg:flex-row md:flex-col sm:flex-row flex-col">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="lg:w-1/2 md:w-full sm:w-1/2 w-full">
                    <FormLabel>Prezzo € (EUR)</FormLabel>
                    <FormControl>
                      <Input placeholder="9,99" {...field} className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="negotiable_price"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 lg:ms-3 md:ms-0 sm:ms-3 ms-0 lg:mt-[2.6rem] md:mt-4 sm:mt-[2.6em] mt-4">
                    <FormControl>
                      <Checkbox
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Prezzo negoziabile
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="..." {...field} className="h-32 resize-zone" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={() => {
                return (
                  <FormItem>
                    <FormControl>
                      <RatingSelector
                        rating={rating}
                        setRating={setRating}
                      />
                    </FormControl>
                  </FormItem>
                )
              }}
            />
          </div>
        </div>
        <div className="flex gap-x-2 w-full justify-end">
          <Button
            onClick={cancelCreate}
            variant="secondary"
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

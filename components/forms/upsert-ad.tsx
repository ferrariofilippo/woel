"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RatingSelector } from "@/components/ui/rating-selector";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Advertisement } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../ui/use-toast";

var sprintf = require("sprintf-js").sprintf,
  vsprintf = require("sprintf-js").vsprintf;

interface UpsertAdParams {
  advertisement: Advertisement | null;
  books:
    | {
        isbn: string;
        title: string;
      }[]
    | null;
  userId: string;
}

export function UpsertAdForm({ advertisement, books, userId }: UpsertAdParams) {
  const i18nCommon = useTranslations("Common");
  const i18n = useTranslations("CreateAd");
  const i18nAd = useTranslations("Advertisment");
  const i18nValidation = useTranslations("Validation");

  const upsertAdvertisementSchema = z.object({
    book_id: z.string().min(1),
    creation_date: z.date().optional(),
    id: z.number().optional(),
    negotiable_price: z.boolean(),
    notes: z.string().optional(),
    owner_id: z.string().optional(),
    price: z
      .string()
      .refine((val) => !Number.isNaN(parseFloat(val.replace(",", "."))), {
        message: sprintf(i18nValidation("MustBe"), i18nCommon("Positive")),
      })
      .refine((val) => parseFloat(val.replace(",", ".")) > 0, {
        message: sprintf(i18nValidation("MustBeHigher"), "99.9"),
      })
      .refine((val) => parseFloat(val.replace(",", ".")) <= 99.99, {
        message: sprintf(i18nValidation("MustBeLower"), "99.9"),
      }),
    rating: z
      .number()
      .min(
        1,
        sprintf(
          i18nValidation("MustBeBetween"),
          i18nCommon("Awful"),
          i18nCommon("Excellent")
        )
      )
      .max(
        5,
        sprintf(
          i18nValidation("MustBeBetween"),
          i18nCommon("Awful"),
          i18nCommon("Excellent")
        )
      )
      .optional(),
    status: z.string().optional(),
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [rating, setRating] = useState(advertisement?.rating ?? 3);
  const [imageNames, setImages] = useState(Array<string>());
  const [hasImages, setHasImages] = useState(false);
  const [imagesToRemove] = useState(Array<string>());
  const [newImages] = useState(Array<string>());
  const oldImages = Array<string>();

  const upsertAdvertisement = async (
    ad: z.infer<typeof upsertAdvertisementSchema>
  ) => {
    setIsSavingChanges(true);

    const noError = advertisement
      ? await editAdvertisement(ad)
      : await addAdvertisement(ad);

    if (noError) {
      toast({
        variant: "default",
        description: `${i18nCommon("Advertisment")} ${
          advertisement ? i18nCommon("Edited") : i18nCommon("Created")
        } ${i18nCommon("Succesfully")}`,
      });
      router.push("/");
    }

    setIsSavingChanges(false);
  };

  const addAdvertisement = async (
    ad: z.infer<typeof upsertAdvertisementSchema>
  ) => {
    const { data } = await supabase
      .from("advertisement")
      .insert({
        id: undefined,
        owner_id: userId,
        book_id: ad.book_id,
        negotiable_price: ad.negotiable_price,
        notes: ad.notes,
        price: parseFloat(ad.price.replace(",", ".")),
        rating: rating,
        status: "Available",
      })
      .select();

    if (!data) return false;

    for (let i = 0; i < newImages.length; i++) {
      await supabase.from("advertisement_picture").insert({
        advertisement_id: data[0].id,
        id: undefined,
        url: newImages[i],
        isCover: i === 0,
      });
    }

    return true;
  };

  const editAdvertisement = async (
    ad: z.infer<typeof upsertAdvertisementSchema>
  ) => {
    const { data } = await supabase
      .from("advertisement")
      .update({
        id: advertisement!.id,
        owner_id: advertisement!.owner_id,
        status: advertisement!.status,
        book_id: ad.book_id,
        negotiable_price: ad.negotiable_price,
        notes: ad.notes,
        price: parseFloat(ad.price.replace(",", ".")),
        rating: rating,
      })
      .eq("id", advertisement?.id)
      .select();

    if (!data) return false;

    await deletePictures();
    for (let i = 0; i < newImages.length; i++) {
      await supabase.from("advertisement_picture").insert({
        advertisement_id: advertisement!.id,
        id: undefined,
        url: newImages[i],
        isCover: newImages.length === imageNames.length && i === 0,
      });
    }

    return true;
  };

  const addPictures = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    if (!target.files || !target.files.length) return;

    setIsLoading(true);
    for (let i = 0; i < target.files.length; i++) {
      const extension = target.files[i].name.split(".").pop();
      if (
        ["PNG", "JPG", "JPEG"].includes(extension?.toLocaleUpperCase() ?? "")
      ) {
        const name = `${crypto.randomUUID().toString()}.${extension}`;

        await supabase.storage.from("images").upload(name, target.files[i], {
          cacheControl: "3600",
          upsert: true,
        });

        imageNames.push(name);
        newImages.push(name);
      }
    }

    setHasImages(imageNames.length !== 0);
    setIsLoading(false);
  };

  const deletePictures = async () => {
    if (!imagesToRemove.length) return;

    await supabase.storage.from("images").remove(imagesToRemove);
    for (const url of imagesToRemove) {
      await supabase
        .from("advertisement_picture")
        .delete()
        .eq("advertisement_id", advertisement?.id)
        .eq("url", url);
    }
  };

  const removePicture = async (url: string) => {
    const index = imageNames.indexOf(url);
    if (index === -1) return;

    const newImageIndex = newImages.indexOf(url);
    if (newImageIndex !== -1) newImages.splice(newImageIndex, 1);

    setIsLoading(true);
    imagesToRemove.push(imageNames[index]);
    imageNames.splice(index, 1);
    setImages(imageNames.slice(0));
    setHasImages(imageNames.length !== 0);
    setIsLoading(false);
  };

  const cancel = async () => {
    const toDelete = newImages.slice(0);
    for (const img of imagesToRemove) {
      if (oldImages.indexOf(img) === -1) toDelete.push(img);
    }

    await supabase.storage.from("images").remove(toDelete);
    router.push("/");
  };

  const form = useForm<z.infer<typeof upsertAdvertisementSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(upsertAdvertisementSchema),
    defaultValues: {
      book_id: advertisement?.book_id ?? "",
      negotiable_price: advertisement?.negotiable_price ?? false,
      notes: advertisement?.notes ?? "",
      price: advertisement?.price.toString() ?? "9.99",
    },
  });

  const loadImages = async () => {
    imagesToRemove.splice(0);
    newImages.splice(0);
    oldImages.splice(0);

    if (!advertisement) return;

    setIsLoading(true);

    const { data } = await supabase
      .from("advertisement_picture")
      .select("url")
      .eq("advertisement_id", advertisement.id)
      .order("isCover", { ascending: false });

    imageNames.splice(0);
    if (data) {
      for (const d of data) {
        imageNames.push(d.url as string);
        oldImages.push(d.url as string);
      }

      setHasImages(imageNames.length !== 0);
    }

    setIsLoading(false);
  };

  // NOTE: Empty dependency array is needed to execute 'useEffect' only once
  useEffect(() => {
    const loadData = async () => {
      await loadImages();
    };

    loadData();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(upsertAdvertisement)}
        className="lg:px-24 sm:px-12 px-6"
      >
        <h1 className="my-5 text-3xl font-semibold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">
          {advertisement ? i18nCommon("Edit") : i18nCommon("Create")}
        </h1>
        <div className="flex md:flex-row flex-col mx-auto mb-8 min-h-[70vh] md:max-h-[80vh] lg:max-h-[90vh] gap-x-10 gap-y-8">
          <div className="flex flex-col gap-y-4 md:w-3/5 w-full items-center min-h-full max-h-full">
            <div className="flex justify-between w-full h-12">
              <h3 className="text-xl font-semibold my-auto">
                {sprintf(i18n("LoadThing"), i18nCommon("Images"))}
              </h3>
              <label
                className={cn(
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-[0.65rem] rounded-md font-medium text-sm",
                  hasImages ? "block" : "hidden"
                )}
              >
                {i18nCommon("Add")}
                <input
                  id="add-file-input"
                  type="file"
                  className="hidden"
                  onChange={addPictures}
                  multiple
                  accept=".jpg,.jpeg,.png"
                />
              </label>
            </div>
            <div
              className={cn(
                "border-2 border-gray-500 border-dashed rounded-lg lg:h-[calc(100%-3rem)] max-h-[calc(100%-3rem)] w-full lg:pb-5 pb-4 p-3 overflow-y-auto hover:bg-neutral-100 dark:hover:bg-neutral-900",
                hasImages ? "flex flex-wrap justify-between" : "hidden"
              )}
            >
              {isLoading ? (
                <Icons.spinner className="h-16 w-16 animate-spin mx-auto my-auto" />
              ) : (
                imageNames.map((name: string) => {
                  return (
                    <div
                      className="lg:w-1/2 w-full lg:mt-2 mt-1 lg:px-2 px-1 mb-auto relative"
                      key={name}
                    >
                      <Image
                        id={name}
                        width={360}
                        height={240}
                        src={
                          supabase.storage.from("images").getPublicUrl(name)
                            .data.publicUrl
                        }
                        className="rounded-lg w-full h-auto border border-neutral-300"
                        alt={name}
                      />
                      {name === imageNames[0] && (
                        <div className="absolute inset-x-4 inset-y-2 flex justify-start items-end z-10">
                          <span className="py-1 px-2 bg-neutral-950 bg-opacity-70 rounded-lg text-sm">
                            {i18nAd("Cover")}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-2 inset-y-0 flex justify-end items-end z-10">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={async () => await removePicture(name)}
                          className="m-1 p-2"
                        >
                          <Icons.trash className="h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <label
              htmlFor="file-input"
              className={cn(
                "items-center justify-center lg:h-[calc(100%-3rem)] md:max-h-[calc(100%-3rem)] w-full lg:pb-5 pb-4 h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-accent dark:border-gray-600 dark:hover:border-gray-500",
                hasImages ? "hidden" : "flex flex-col"
              )}
            >
              {isLoading ? (
                <Icons.spinner className="h-16 w-16 animate-spin" />
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                      <span className="font-semibold">
                        {i18n("ClickHereToUpLoad")}
                      </span>
                      {i18n("ClickAndRelese")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      (JPG, PNG, JPEG)
                    </p>
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={addPictures}
                    multiple
                    accept=".jpg,.jpeg,.png"
                  />
                </>
              )}
            </label>
          </div>
          <div className="md:w-2/5 w-full flex flex-col gap-y-4">
            <FormField
              control={form.control}
              name="book_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{i18nCommon("Book")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between text-ellipsis truncate text-center px-2",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && books
                            ? books.find((book) => book.isbn === field.value)
                                ?.title
                            : sprintf(
                                i18n("ChooseA"),
                                i18nCommon("Book").toLowerCase()
                              )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[24rem] w-[85vw] p-0">
                      <Command>
                        <CommandInput
                          placeholder={
                            i18nCommon("SearchPlaceholder") + i18nCommon("Book")
                          }
                        />
                        <CommandEmpty>
                          <div className="flex flex-col">
                            {sprintf(
                              i18nValidation("XNotFound"),
                              i18nCommon("Book")
                            )}
                          </div>
                        </CommandEmpty>
                        <CommandGroup>
                          {books?.map((book) => (
                            <CommandItem
                              value={book.isbn}
                              key={book.isbn}
                              onSelect={(value) =>
                                form.setValue("book_id", value)
                              }
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  book.isbn === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                {book.title}
                                <span className="text-sm">{book.isbn}</span>
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
                    <FormLabel>{i18nCommon("Price")} € (EUR)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="9.99"
                        {...field}
                        className="text-right"
                      />
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
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {i18n("NegotiablePrice")}
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
                    <Textarea
                      placeholder="..."
                      {...field}
                      className="h-32 resize-zone"
                    />
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
                      <RatingSelector rating={rating} setRating={setRating} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-x-2 w-full justify-end mb-8">
          <Button
            onClick={cancel}
            variant="secondary"
            type="button"
            disabled={isSavingChanges}
          >
            {i18nCommon("Undo")}
          </Button>
          <Button type="submit" className="px-10" disabled={isSavingChanges}>
            {isSavingChanges && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {advertisement ? i18nCommon("Edit") : i18nCommon("Create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

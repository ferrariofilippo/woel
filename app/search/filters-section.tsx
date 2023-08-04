"use client"

import { Button } from "@/components/ui";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchComponent } from "@/components/ui/search-component";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { JoinedAd } from "@/types/joined-ad";
import { CheckIcon } from "@radix-ui/react-icons";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { useState } from "react";

const MIN_PRICE = 0;
const MAX_PRICE = 100;
const DEFAULT_YEAR = 5;
const MATCH_ALL = "%";
const DEFAULT_FETCH_AMOUNT = 10;

interface FiltersSectionParams {
  setData: Function,
  supabase: SupabaseClient<any, "public", any>
}

export function FiltersSection({ setData, supabase }: FiltersSectionParams) {
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState(0);
  const [price, setPrice] = useState(50.0);
  const [query, setQuery] = useState("");

  const years = [1, 2, 3, 4, 5];

  const filter = async () => {
    const { data } = await supabase
      .from("advertisement")
      .select(
        `id, price, negotiable_price, rating, notes, status,
      book:book_id (
        isbn, title, author, subject, year
      ),
      owner:owner_id (
        id, full_name, username, email
      ),
      advertisement_picture (
        url
      ),
      saved_ad (
        advertisement_id
      ),
      interested_in_ad (
        advertisement_id
      )`
      )
      .filter("status", "eq", "Available")
      .not("book", "is", null)
      .filter("price", "lte", price)
      .ilike("book.subject", `%${subject}%`)
      .filter("book.year", year ? "eq" : "neq", year)
      .or(`isbn.like.%${query}%,title.ilike.%${query}%`, { foreignTable: "book" })
      .order("creation_date", {
        ascending: false
      })
      .limit(DEFAULT_FETCH_AMOUNT);

    const ads = Array<JoinedAd>();
    data?.forEach(ad => ads.push(ad as unknown as JoinedAd));

    setData(ads);
  };

  var isFilterSectionExpanded = false;

  return (
    <div
      id="filters-drawer"
      className="fixed z-40 sm:w-[calc(100%-12rem)] w-[calc(100%-3rem)] overflow-y-auto bg-white border-b border-neutral-200 rounded-b-lg dark:border-neutral-800 dark:bg-neutral-900 transition-transform top-[64px] -translate-y-[236px]"
      tabIndex={-1}
      aria-labelledby="filters-swipe-label"
    >
      <div className="flex flex-col p-4 gap-4 w-1/2 mx-auto">
        <div className="flex gap-2">
          <div className="w-6 h-6 my-auto">
            <svg
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <h1 className="font-semibold text-lg">
            Filtri
          </h1>
        </div>
        <SearchComponent 
          onChangeHandler={async (event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
            await filter();
          }}
        />
        <div className="flex justify-around w-full">
          <Input
            className="w-1/3"
            type="text"
            placeholder="Materia..."
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              setSubject(event.target.value);
              await filter();
            }}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between w-1/3",
                  !year && "text-muted-foreground"
                )}
              >
                {year
                  ? years.find(y => y === year)
                  : "Scegli l'anno"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100 p-0">
              <Command>
                <CommandGroup>
                  {years.map((y) => (
                    <CommandItem
                      value={y.toString()}
                      key={y}
                      onSelect={async (value) => {
                        setYear(parseInt(value));
                        await filter();
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          y === year
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {y}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="price_slider">Prezzo massimo</Label>
            <span className="rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
              € {price < 10
                ? price.toPrecision(3)
                : price.toPrecision(4)
              }
            </span>
          </div>
          <Slider
            id="price_slider"
            defaultValue={[50.0]}
            min={0}
            max={99.5}
            step={0.5}
            onValueChange={async (value) => {
              setPrice(value[0]);
              await filter();
            }}
            aria-label="Prezzo massimo"
          />
        </div>
      </div>
      <div
        className="p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
        onClick={() => {
          const drawer = document.getElementById("filters-drawer");
          if (isFilterSectionExpanded) {
            drawer?.classList.add("-translate-y-[236px]");
          } else {
            drawer?.classList.remove("-translate-y-[236px]");
          }

          isFilterSectionExpanded = !isFilterSectionExpanded;
        }}
      >
        <span className="absolute w-8 h-1 -translate-x-1/2 bg-neutral-300 rounded-lg bottom-3 left-1/2 dark:bg-neutral-600"></span>
      </div>
    </div>
  )
}

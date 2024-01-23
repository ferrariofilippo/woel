"use client"

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SearchComponentParams {
  onChangeHandler?: Function | undefined
}

export function SearchComponent({ onChangeHandler }: SearchComponentParams) {
  const router = useRouter();
  var query = "";

  return (
    <Input
      id="searchbar"
      type="search"
      placeholder="Cerca un libro..."
      className="flex"
      onChange={onChangeHandler
        ? (event: React.ChangeEvent<HTMLInputElement>) => onChangeHandler(event)
        : (event: React.ChangeEvent<HTMLInputElement>) => {
          query = event.target.value;
        }
      }
      onKeyDown={onChangeHandler
        ? () => { }
        : (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.code === "Enter") {
            router.push(`/search?q=${query}`)
          }
        }
      }
    />
  );
}

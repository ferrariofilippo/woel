import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getShortName = (name: string) => {
  const nameWords = name.split(" ").map((i: string) => i[0].toUpperCase());
  return nameWords[0] + nameWords[1];
};

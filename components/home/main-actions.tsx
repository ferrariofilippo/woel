"use client"

import { useRouter } from "next/navigation";
import { Button } from "../ui";

export function MainActions() {
  const router = useRouter();

  return (
    <>
      {/* <Image /> */}
      <h1
        className="mt-5 mb-12 text-3xl font-semibold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white text-center"
      >
        Inizia a vendere i tuoi libri
      </h1>
      <div
        className="flex md:flex-row flex-col gap-2 lg:mx-64 mx-0"
      >
        <Button
          variant="default"
          className="md:w-1/2 w-full"
          onClick={() => router.push("/create")}
        >
          Vendi subito
        </Button>
        <Button
          className="md:w-1/2 w-full"
          variant="secondary"
          onClick={() => router.push("/info")}
        >
          Scopri di più
        </Button>
      </div></>
  )
}
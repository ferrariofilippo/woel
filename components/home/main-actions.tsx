"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "../ui";

export function MainActions() {
  const router = useRouter();
  const t = useTranslations("MainActions");
  return (
    <>
      <div className="flex items-center justify-center w-full h-48 rounded sm:w-96 mx-auto">
        <svg
          className="w-full h-full text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white text-center">
        {t("TitleH1")}
      </h1>
      <div className="flex md:flex-row flex-col gap-2 lg:mx-64 mx-0">
        <Button
          variant="default"
          className="md:w-1/2 w-full"
          onClick={() => router.push("/create")}
        >
          {t("CreateBtn")}
        </Button>
        <Button
          className="md:w-1/2 w-full"
          variant="secondary"
          onClick={() => router.push("/info")}
        >
          {t("InfoBtn")}
        </Button>
      </div>
    </>
  );
}

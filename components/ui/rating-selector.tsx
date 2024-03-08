"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { Label } from "./label";
import { Slider } from "./slider";

interface RatingSelectorProps {
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}

export function RatingSelector({ rating, setRating }: RatingSelectorProps) {
  const i18nCommon = useTranslations("Common");
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="rating">{i18nCommon("Conditions")}</Label>
        <span className="rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {rating} -{" "}
          {rating
            ? rating === 1
              ? i18nCommon("Awful")
              : rating === 2
              ? i18nCommon("Mediocre")
              : rating === 3
              ? i18nCommon("Discrete")
              : rating === 4
              ? i18nCommon("Good")
              : i18nCommon("Excellent")
            : ""}
        </span>
      </div>
      <Slider
        id="rating"
        max={5}
        min={1}
        defaultValue={[rating]}
        step={1}
        onValueChange={(value) => {
          setRating(value[0]);
        }}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label={i18nCommon("Conditions")}
      />
    </div>
  );
}

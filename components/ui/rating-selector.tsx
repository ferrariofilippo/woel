"use client"

import * as React from "react";
import { Slider } from "./slider";
import { Label } from "./label";

interface RatingSelectorProps {
  rating: number,
  setRating: React.Dispatch<React.SetStateAction<number>>,
}

export function RatingSelector({
  rating,
  setRating
}: RatingSelectorProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="rating">Condizioni</Label>
        <span className="rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {rating} - {
            rating
              ? rating === 1
                ? "Pessime"
                : rating === 2
                  ? "Mediocri"
                  : rating === 3
                    ? "Discrete"
                    : rating === 4
                      ? "Buone"
                      : "Ottime"
              : ""
          }
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
        aria-label="Condizioni"
      />
    </div>
  );
}

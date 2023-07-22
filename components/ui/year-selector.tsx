"use client"

import * as React from "react";
import { Slider } from "./slider";
import { Label } from "./label";

interface YearSelectorProps {
  year: number,
  setYear: React.Dispatch<React.SetStateAction<number>>,
}

export function YearSelector({
  year,
  setYear
}: YearSelectorProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="temperature">Anno</Label>
        <span className="rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {year}
        </span>
      </div>
      <Slider
        id="rating"
        max={5}
        min={1}
        defaultValue={[year]}
        step={1}
        onValueChange={(value) => {
          setYear(value[0]);
        }}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Anno"
      />
    </div>
  );
}

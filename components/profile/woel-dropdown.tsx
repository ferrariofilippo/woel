"use client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
interface WoelDropdownProps {
  form: any;
  collection: any[];
  fieldTemplate: DropDownFieldTemplate;
  dropdownDescription?: string;
}
export const WoelDropdown = ({
  form,
  collection,
  fieldTemplate,
  dropdownDescription,
}: WoelDropdownProps) => {
  let dropdownItems: DropDownField[] = formatDropdownLabels(
    collection,
    fieldTemplate
  );
  return (
    <FormField
      control={form.control}
      name={fieldTemplate.label}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTemplate.name}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? dropdownItems.find(
                        (item: DropDownField) => item.value === field.value
                      )?.label
                    : "Select " + fieldTemplate.name}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={`Search ${fieldTemplate.name}...`} />
                <CommandEmpty>No {fieldTemplate.name} found.</CommandEmpty>
                <CommandGroup>
                  {dropdownItems.map((item: DropDownField) => (
                    <CommandItem
                      value={item.label}
                      key={item.value.toString()}
                      onSelect={() => {
                        form.setValue(fieldTemplate.label, item.value);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          item.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{dropdownDescription}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export type DropDownFieldTemplate = {
  label: string;
  value: string;
  name: string;
};
export type DropDownField = {
  label: string;
  value: number;
};
export const formatDropdownLabels = (
  data: any,
  fieldTemplate: DropDownFieldTemplate
): DropDownField[] => {
  let ret = [];
  if (data) {
    ret = data.map((item: any) => {
      return {
        label: item[fieldTemplate.label],
        value: item[fieldTemplate.value],
      };
    });
  }
  return ret;
};

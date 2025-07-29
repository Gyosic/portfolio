"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const filterSchema = z.object({
  searchKeyword: z.string().optional(),
});
export type FilterSchema = z.infer<typeof filterSchema>;

interface SiteFilterProps {
  setFilter: Dispatch<SetStateAction<FilterSchema>>;
}
export function SiteFilter({ setFilter }: SiteFilterProps) {
  const form = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    mode: "onBlur",
    defaultValues: {
      searchKeyword: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = handleSubmit((data) => {
    setFilter(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="searchKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>검색어를 입력하세요</FormLabel>
                <FormControl>
                  <Input placeholder="사이트명..." {...field} value={field.value || ""}></Input>
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="mt-auto" variant={"outline"} type="submit">
            <Search />
          </Button>
        </div>
      </form>
    </Form>
  );
}

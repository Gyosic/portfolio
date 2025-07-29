"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Combobox from "@/components/shared/Combobox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContractType } from "@/lib/schema/contract.schema";
import { SiteType } from "@/lib/schema/site.schema";

export const filterSchema = z.object({
  searchKeyword: z.string().optional(),
  site_id: z.string().optional(),
  contract_id: z.string().optional(),
});
export type FilterSchema = z.infer<typeof filterSchema>;

interface DeviceFilterProps {
  setFilter: Dispatch<SetStateAction<FilterSchema>>;
  sites: SiteType[];
  contracts: ContractType[];
}
export function DeviceFilter({ setFilter, sites, contracts }: DeviceFilterProps) {
  const { siteItems, contractItems } = useMemo(() => {
    const siteItems = sites.map(({ _id, service_name }) => ({ label: service_name, value: _id }));
    const contractItems = contracts.map(({ _id, title }) => ({ label: title, value: _id }));

    return { siteItems, contractItems };
  }, [sites, contracts]);
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
            name="site_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사이트</FormLabel>
                <FormControl>
                  <Combobox
                    className="w-auto min-w-60"
                    items={siteItems}
                    {...field}
                    onValueChange={(e) => field.onChange(e)}
                  ></Combobox>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contract_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>계약</FormLabel>
                <FormControl>
                  <Combobox
                    className="w-auto min-w-80"
                    items={contractItems}
                    {...field}
                    onValueChange={(e) => field.onChange(e)}
                  ></Combobox>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="searchKeyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>검색어를 입력하세요</FormLabel>
                <FormControl>
                  <Input placeholder="시리얼번호..." {...field} value={field.value || ""}></Input>
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

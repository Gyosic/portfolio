"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import TemplateFormItem from "@/components/shared/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  HistoryFormType,
  HistoryType,
  historyFormSchema,
  historyModel,
} from "@/lib/schema/history.schema";

interface HistoryUpdateProps {
  history: HistoryType;
}
export default function HistoryUpdate({ history }: HistoryUpdateProps) {
  const router = useRouter();

  const form = useForm<HistoryFormType>({
    resolver: zodResolver(historyFormSchema),
    mode: "onBlur",
    defaultValues: history,
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    if (!history._id) return;

    const res = await fetch(`/api/histories/${history._id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return toast.error(await res.text());

    toast.success("경력 변경 성공!");

    router.back();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(historyModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof typeof historyModel}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}

          <div className="mt-2 flex">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button type="submit" className="flex-1">
              변경
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

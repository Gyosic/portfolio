"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TemplateFormItem } from "@/components/shared/form/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  AchievementFormType,
  AchievementType,
  achievementFormSchema,
  achievementModel,
} from "@/lib/schema/achievement.schema";

interface AchievementUpdateProps {
  achievement: AchievementType;
}
export function AchievementUpdate({ achievement }: AchievementUpdateProps) {
  const router = useRouter();

  const form = useForm<AchievementFormType>({
    resolver: zodResolver(achievementFormSchema),
    mode: "onBlur",
    defaultValues: achievement,
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    if (!achievement._id) return;

    const res = await fetch(`/api/achievements/${achievement._id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return toast.error(await res.text());

    toast.success("활동 변경 성공!");

    router.back();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(achievementModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof typeof achievementModel}
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

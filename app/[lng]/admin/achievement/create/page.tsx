"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TemplateFormItem } from "@/components/shared/form/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import {
  AchievementFormType,
  achievementFormSchema,
  achievementModel,
} from "@/lib/schema/achievement.schema";

export default function AchievementCreate() {
  const router = useRouter();
  const session = useSession();

  const form = useForm<AchievementFormType>({
    resolver: zodResolver(achievementFormSchema),
    mode: "onBlur",
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/achievements/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return toast.error(await res.text());

    toast.success("활동 등록 성공!");

    router.back();
  });

  useEffect(() => {
    if (session.status === "unauthenticated") router.push("/admin");
  }, [session]);

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
              등록
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

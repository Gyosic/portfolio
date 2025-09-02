"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TemplateFormItem } from "@/components/shared/form/TemplateFormItem";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { MailFormType, mailFormSchema, mailModel } from "@/lib/schema/mail.schema";

interface ContactFormProps {
  lng: Language;
}
export function ContactForm({ lng }: ContactFormProps) {
  const router = useRouter();
  const { t } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const form = useForm<MailFormType>({
    resolver: zodResolver(mailFormSchema),
    mode: "onBlur",
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return toast.error(await res.text());

    toast.success(`${t("Mail sent successfully")}!`);

    router.push("/");
  });

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className="icon_underline">{t("Send me a mail")}.</CardTitle>
            <CardDescription>
              {t("Once form is submit you will be redirect to home page")}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2 flex flex-col gap-2">
              {Object.entries(mailModel).map(([key, model]) => {
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key as keyof typeof mailModel}
                    render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
                  />
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="mt-2 w-full">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

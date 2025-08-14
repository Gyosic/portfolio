"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

interface SignInProps extends React.ComponentProps<"div"> {
  className?: string;
  callbackUrl?: string;
}
export function SignIn({ className, callbackUrl = "/admin", ...props }: SignInProps) {
  const { lng } = useParams<{ lng: Language }>();
  const router = useRouter();

  const { t, ready } = useTranslation(lng, "translation", {
    useSuspense: false,
  });

  const credentialSchema = z.object({
    username: z.string().min(1, {
      message: t("Username is required"),
    }),
    password: z.string().min(1, {
      message: t("Password is required"),
    }),
  });

  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);

  const form = useForm<z.infer<typeof credentialSchema>>({
    resolver: zodResolver(credentialSchema),
    defaultValues: { username: "", password: "" },
  });

  // 2. Define a submit handler.
  const handleSubmit = async (inputs: z.infer<typeof credentialSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const res = await signIn("credentials", {
      ...inputs,
      redirect: false,
    });

    if (res.error) {
      return toast(`[${t("Login")}]`, {
        description: `${t("Login failed")}.`,
        position: "top-right",
      });
    }

    if (remember) {
      localStorage.setItem("rememberUsername", inputs.username!);
      localStorage.setItem("remember", remember.toString());
    } else {
      localStorage.removeItem("rememberUsername");
      localStorage.removeItem("remember");
    }

    return router.push(callbackUrl);
  };

  const handleChangeRemember = (isRemember: boolean) => {
    setRemember(isRemember);
  };

  useEffect(() => {
    const username = localStorage.getItem("rememberUsername");
    const remember = localStorage.getItem("remember") === "true";

    if (username && remember) {
      form.setValue("username", username);
      setRemember(remember);
    }
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{!!ready && t("Login for system administration")}</CardTitle>
          <CardDescription>
            {!!ready && t("To log in to system management, please enter your login ID below")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel>{ready && t("Username")}</FormLabel>
                        <FormControl>
                          <div className="flex w-full">
                            <Input
                              className="bg-white"
                              placeholder={ready ? t("Plase enter your username") : ""}
                              {...field}
                            />
                            <div />
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3">
                        <FormLabel className="w-24">{ready && t("Password")}</FormLabel>
                        <FormControl>
                          <div className="flex w-full items-center gap-2">
                            <Input
                              id="current-password"
                              className="bg-white"
                              type={visiblePassword ? "text" : "password"}
                              placeholder={ready ? t("Please enter your password") : ""}
                              required
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="hover:bg-[#4fc3f7]/30"
                              onClick={() => setVisiblePassword((prev) => !prev)}
                            >
                              {visiblePassword ? <Eye /> : <EyeClosed />}
                            </Button>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="ml-auto flex gap-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={handleChangeRemember}
                  ></Checkbox>
                  <Label htmlFor="remember">{ready && t("Save your login ID")}</Label>
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    {ready && t("Login")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

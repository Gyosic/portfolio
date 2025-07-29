"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginBg from "@/public/images/login_bg.jpg";

interface SigninFormProps {
  callbackUrl?: string;
}

export function SigninForm({ callbackUrl = "/" }: SigninFormProps) {
  const router = useRouter();

  const credentialSchema = z.object({
    username: z.string().min(1, {
      message: "Username is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  });

  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [cookies] = useCookies(["auth_error"]);

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
      return toast("[로그인]", {
        description: cookies.auth_error || "로그인에 실패하였습니다.",
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
    <div className="h-full w-full lg:flex">
      <div className="flex h-full flex-1 flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 px-20">
                <div className="flex flex-col gap-4">
                  <span className="font-bold text-2xl italic">Device Management System</span>
                  <div className="flex flex-col space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-2">
                            <FormLabel className="w-auto">이메일 또는 사용자아이디</FormLabel>
                            <FormControl>
                              <div className="flex w-full">
                                <Input
                                  className="bg-white"
                                  placeholder={"Plase enter your username"}
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
                          <div className="flex flex-col gap-2">
                            <FormLabel className="w-24">비밀번호</FormLabel>
                            <FormControl>
                              <div className="flex w-full items-center gap-2">
                                <Input
                                  id="current-password"
                                  className="bg-white"
                                  type={visiblePassword ? "text" : "password"}
                                  placeholder="비밀번호를 입력해주세요"
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
                      <Label htmlFor="remember">로그인 ID 저장</Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    className="w-full py-7 font-semibold text-lg"
                  >
                    로그인
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="relative hidden h-full w-full flex-2 bg-muted lg:block">
        <Image
          src={LoginBg}
          alt="Login Background"
          className="absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale"
          width="0"
          height="0"
          unoptimized
        />
      </div>
    </div>

    // <div className="relative flex flex-col items-center justify-center">
    //   <Card className="w-full space-y-20 rounded-3xl border-gradient bg-background/10 px-0.5 py-20">
    //     <CardHeader className="relative p-0">
    //       <CardTitle className="px-6 text-2xl">
    //         Device Management System
    //       </CardTitle>
    //     </CardHeader>

    //     <CardContent className="p-0">
    //       <Form {...form}>
    //         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 px-16">
    //           <div className="grid gap-20">
    //             <div className="flex flex-col space-y-4">
    //               <div className="grid gap-2">
    //                 <FormField
    //                   control={form.control}
    //                   name="username"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <div className="flex items-center gap-2">
    //                         <FormLabel className="w-24">Username</FormLabel>
    //                         <FormControl>
    //                           <div className="flex w-full">
    //                             <Input
    //                               className="bg-white"
    //                               placeholder={"Plase enter your username"}
    //                               {...field}
    //                             />
    //                             <div />
    //                           </div>
    //                         </FormControl>
    //                       </div>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />
    //               </div>
    //               <div className="grid gap-2">
    //                 <FormField
    //                   control={form.control}
    //                   name="password"
    //                   render={({ field }) => (
    //                     <FormItem>
    //                       <div className="flex items-center gap-2">
    //                         <FormLabel className="w-24">비밀번호</FormLabel>
    //                         <FormControl>
    //                           <div className="flex w-full items-center gap-2">
    //                             <Input
    //                               id="current-password"
    //                               className="bg-white"
    //                               type={visiblePassword ? "text" : "password"}
    //                               placeholder="비밀번호를 입력해주세요"
    //                               required
    //                               {...field}
    //                             />
    //                             <Button
    //                               type="button"
    //                               variant="ghost"
    //                               size="icon"
    //                               className="hover:bg-[#4fc3f7]/30"
    //                               onClick={() => setVisiblePassword((prev) => !prev)}
    //                             >
    //                               {visiblePassword ? <Eye /> : <EyeClosed />}
    //                             </Button>
    //                           </div>
    //                         </FormControl>
    //                       </div>
    //                       <FormMessage />
    //                     </FormItem>
    //                   )}
    //                 />
    //               </div>
    //               <div className="ml-auto flex gap-2">
    //                 <Checkbox
    //                   id="remember"
    //                   checked={remember}
    //                   onCheckedChange={handleChangeRemember}
    //                 ></Checkbox>
    //                 <Label htmlFor="remember">로그인 ID 저장</Label>
    //               </div>
    //             </div>

    //             <Button
    //               type="submit"
    //               size="lg"
    //               variant="default"
    //               className="w-full py-10 font-semibold text-xl"
    //             >
    //               {"Login"}
    //             </Button>
    //           </div>
    //         </form>
    //       </Form>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}

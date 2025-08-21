import z from "zod";
import { buildSchema } from "../zod";
import { Model } from "./model";

export const mailModel = {
  name: { name: "Name", type: "text", placeholder: "Enter your name" },
  email: { name: "Email", type: "email", placeholder: "Enter your email" },
  message: { name: "Your Message", type: "textarea", placeholder: "Your message here..." },
} as const satisfies Record<string, Model>;

export const mailFormSchema = buildSchema(mailModel);

export type MailFormType = z.infer<typeof mailFormSchema>;

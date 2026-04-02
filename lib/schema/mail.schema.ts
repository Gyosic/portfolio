import z from "zod";
import { buildSchema } from "../zod";
import { email, text, textarea } from "./field";

export const mailModel = {
  name: text({ name: "Name", placeholder: "Enter your name" }),
  email: email({ name: "Email", placeholder: "Enter your email" }),
  message: textarea({ name: "Your Message", placeholder: "Your message here..." }),
};

export const mailFormSchema = buildSchema(mailModel);

export type MailFormType = z.infer<typeof mailFormSchema>;

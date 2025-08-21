import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { mailFormSchema } from "@/lib/schema/mail.schema";

const resend = new Resend(process.env.RESEND_API_KEY);
const myEmail = process.env.PERSONAL_EMAIL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = await mailFormSchema.parseAsync(body);

    if (!message) return NextResponse.json("Invalid Message", { status: 400 });

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: myEmail,
      subject: `${name} From Contact Form.`,
      replyTo: `${email}`,
      text: `sender email: ${email} 
     ${message}`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

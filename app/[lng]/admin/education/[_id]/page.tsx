import { redirect } from "next/navigation";
import { api } from "@/config";
import { auth } from "@/lib/auth";
import { EducationUpdate } from "./EducationUpdate";

export const dynamic = "force-dynamic";

const getEducation = async (_id: string) => {
  const res = await fetch(new URL("/api/educations", api.baseurl), {
    method: "POST",
    body: JSON.stringify({ where: [{ field: "_id", operator: "eq", value: _id }] }),
  });

  if (!res.ok) return;

  const { rows = [] } = await res.json();

  return rows[0];
};

interface EducationUpdatePageProps {
  params: Promise<{ _id: string }>;
}

export default async function EducationUpdatePage({ params }: EducationUpdatePageProps) {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  const { _id } = await params;

  const education = await getEducation(_id);

  return <EducationUpdate education={education} />;
}

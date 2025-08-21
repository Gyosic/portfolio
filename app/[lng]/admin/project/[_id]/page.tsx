import { redirect } from "next/navigation";
import { api } from "@/config";
import { auth } from "@/lib/auth";
import { ProjectUpdate } from "./ProjectUpdate";

const getProject = async (_id: string) => {
  const res = await fetch(new URL("/api/projects", api.baseurl), {
    method: "POST",
    body: JSON.stringify({ where: [{ field: "_id", operator: "eq", value: _id }] }),
  });

  if (!res.ok) return;

  const { rows = [] } = await res.json();

  return rows[0];
};

interface ProjectUpdatePageProps {
  params: Promise<{ _id: string }>;
}

export default async function ProjectUpdatePage({ params }: ProjectUpdatePageProps) {
  const sessionContext = await auth();

  if (!sessionContext) return redirect("/admin");

  const { _id } = await params;

  const project = await getProject(_id);

  return <ProjectUpdate project={project} />;
}

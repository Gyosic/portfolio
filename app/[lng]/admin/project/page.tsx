import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProjectTable } from "./ProjectTable";

export default async function ProjectPage() {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  return (
    <div>
      <ProjectTable where={[]} />
    </div>
  );
}

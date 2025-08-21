import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { EducationTable } from "./EducationTable";

export default async function EducationPage() {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  return (
    <div>
      <EducationTable where={[]} />
    </div>
  );
}

import { api } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";
import { Project } from "./Project";

const getProjects = async () => {
  try {
    const res = await fetch(new URL("/api/projects", api.baseurl), {
      method: "POST",
      body: JSON.stringify({ sort: [{ id: "start", desc: true }] }),
    });

    if (!res.ok) return [];

    const { rows = [] } = await res.json();

    return !!rows?.length ? rows : [];
  } catch {
    return [];
  }
};

interface ProjectPageProps {
  params: I18nextPageParams;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lng } = await params;
  const projects = await getProjects();

  return <Project projects={projects} lng={lng} />;
}

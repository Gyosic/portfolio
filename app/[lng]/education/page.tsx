import { api } from "@/config";
import { Education } from "./Education";

const getEducations = async () => {
  const res = await fetch(new URL("/api/educations", api.baseurl), {
    method: "POST",
    body: JSON.stringify({ sort: [{ id: "start", desc: true }] }),
  });

  if (!res.ok) return { rows: [] };

  const { rows = [] } = await res.json();

  return rows.length
    ? rows
    : [
        {
          degree: "Bachelor of Computer Application",
          institution: "Ranchi University Jharkhand",
          location: "Doranda College Ranchi",
          start: "2023-05-02",
          end: "",
          description:
            "I am currently Studying Bachelor of Computer Application form Doranda College Ranchi a Goverment College of Ranchi. The program has provided me with a well-rounded education, covering both theoretical foundations and practical applications of computer science.",
        },
      ];
};
export default async function EducationPage() {
  const educations = await getEducations();

  return <Education educations={educations} />;
}

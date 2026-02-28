import { getProjects } from "@/lib/notion";
import { ProjectsView } from "@/components/ProjectsView";

export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();
  return <ProjectsView initialProjects={projects} />;
}

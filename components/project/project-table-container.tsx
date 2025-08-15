import { getProjectById } from "@/app/data/project/get-project-di";
import { ProjectTable } from "@/app/data/project/project-table";

export const ProjectTableContainer = async ({
  projectId,
}: {
  projectId: string;
}) => {
  const { tasks } = await getProjectById(projectId);
  // Map tasks to match TaskProps structure
  const mappedTasks = tasks.map((task: any) => ({
    ...task,
    assignedTo: task.assignedTo
      ? {
          about: null,
          industryType: "",
          role: "",
          country: "",
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...task.assignedTo,
        }
      : {
          name: "",
          id: "",
          email: "",
          about: null,
          industryType: "",
          role: "",
          country: "",
          image: "",
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
  }));
  return (
    <div className="p-0">
      <ProjectTable tasks={mappedTasks} />
    </div>
  );
};
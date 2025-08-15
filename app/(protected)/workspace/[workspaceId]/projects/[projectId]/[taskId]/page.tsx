
import { getDocumentation } from "@/app/data/project/get-documentation";
import { getTaskById } from "@/app/data/task/get-task-by-id";
import { userRequired } from "@/app/data/user/is-user-authenticated";
import { ProjectDocumentation } from "@/components/project/project-documentation";
import { TaskAttachments } from "@/components/task/task-attachments";
import { TaskComment } from "@/components/task/task-comment";
import { TaskDetails } from "@/components/task/task-details";


import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{
    taskId: string;
    workspaceId: string;
    projectId: string;
  }>;
}

const TaskIdPage = async ({ params }: PageProps) => {
  await userRequired();

  const { taskId, workspaceId, projectId } = await params;
 
  const { task, comments } = await getTaskById(taskId, workspaceId, projectId);

  const documentation = await getDocumentation(projectId);

  if (!task) redirect("/not-found");

return (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:px-6 pb-6">
    
    {/* Left Main Section — 70% */}
    <div className="lg:col-span-8 space-y-6">
      <TaskDetails task={task as any} />

      <ProjectDocumentation
        projectId={task.project.id!}
        workspaceId={workspaceId}
        initialContent={documentation?.content || "<p>Start writing...</p>"}
      />
    </div>

    {/* Right Sidebar — 30% */}
    <div className="lg:col-span-4 space-y-6">
      <TaskComment taskId={taskId} comments={comments as any} />
      <TaskAttachments attachments={task.attachments || []} />
    </div>

  </div>
);
};

export default TaskIdPage;
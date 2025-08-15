import React from "react";


import { getWorkspaceDashboardByWorkspaceId } from "@/app/data/Dashboard/get-workspace-dashboard";
import { Dashboard } from "./Dashboard/page";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

const Page = async (props: PageProps) => {
  const  { workspaceId } = await props.params; 

  const { projects, workspaceMembers, tasks } = await getWorkspaceDashboardByWorkspaceId(workspaceId)

    return (
    <Dashboard projects={projects} workspaceMembers={workspaceMembers} tasks={tasks} />
  );
} 

export default Page 